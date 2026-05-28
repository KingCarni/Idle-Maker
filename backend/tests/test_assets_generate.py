"""Tests for Nano Banana asset generation endpoint.

POST /api/assets/generate -> {image, mime, model, slotId}
- image must be a data URL: 'data:image/...;base64,...'
- Uses Emergent LLM key + gemini-3.1-flash-image-preview
- Generation can take 10-25s; use a generous timeout.
"""
import os
import re
from pathlib import Path
import pytest
import requests
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / "frontend" / ".env")
BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
GEN_URL = f"{BASE_URL}/api/assets/generate"
TIMEOUT = 75  # seconds; per AI hint

DATA_URL_RE = re.compile(r"^data:image/[A-Za-z0-9.+-]+;base64,(.+)$")


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


def _assert_image_response(data: dict, expected_slot: str):
    assert isinstance(data, dict), "response must be JSON object"
    for k in ("image", "mime", "model", "slotId"):
        assert k in data, f"missing key: {k}"
    assert data["slotId"] == expected_slot
    assert isinstance(data["model"], str) and "gemini" in data["model"].lower()
    img = data["image"]
    assert isinstance(img, str) and img.startswith("data:image/"), (
        f"image must start with data:image/, got: {img[:30] if isinstance(img, str) else type(img)}"
    )
    assert ";base64," in img, "image must contain ;base64,"
    m = DATA_URL_RE.match(img)
    assert m, "image does not match data URL pattern"
    b64 = m.group(1)
    assert len(b64) > 500, f"base64 payload suspiciously small: {len(b64)} chars"
    # mime should match the data URL prefix
    assert data["mime"].startswith("image/"), data["mime"]


class TestAssetsGenerate:
    """Nano Banana image generation endpoint"""

    def test_generate_mascot_with_prompt(self, session):
        payload = {
            "slotId": "mascot",
            "label": "Hero / Mascot",
            "prompt": "A small friendly raccoon baker mascot in a tiny apron",
            "conceptTitle": "Cursed Muffin Raccoons",
            "conceptTheme": "Cozy Bakery",
            "conceptTone": "Wholesome chaos",
        }
        # Allow one retry per spec (transient 502 from model is acceptable)
        last = None
        for attempt in range(2):
            r = session.post(GEN_URL, json=payload, timeout=TIMEOUT)
            if r.status_code == 200:
                break
            last = r
        else:
            pytest.fail(
                f"non-200 after retry: status={last.status_code} body={last.text[:300]}"
            )
        assert r.status_code == 200
        _assert_image_response(r.json(), "mascot")

    def test_generate_with_empty_prompt_uses_fallback(self, session):
        payload = {
            "slotId": "moodboard",
            "label": "Moodboard",
            "prompt": "",
        }
        last = None
        for attempt in range(2):
            r = session.post(GEN_URL, json=payload, timeout=TIMEOUT)
            if r.status_code == 200:
                break
            last = r
        else:
            pytest.fail(
                f"non-200 after retry: status={last.status_code} body={last.text[:300]}"
            )
        assert r.status_code == 200
        _assert_image_response(r.json(), "moodboard")

    def test_generate_validation_missing_required_field(self, session):
        # slotId missing -> 422 from FastAPI
        r = session.post(
            GEN_URL,
            json={"label": "x", "prompt": "y"},
            timeout=15,
        )
        assert r.status_code == 422, r.text[:200]
