"""Project persistence API tests.

Covers:
- GET /api/projects (summaries)
- GET /api/projects/{id} (full)
- POST /api/projects
- PUT /api/projects/{id} (concept, title, playground, assets)
- DELETE /api/projects/{id} (and reseed when empty)
- POST /api/projects/{id}/duplicate
- Default seed: 'Cursed Muffin Raccoons'
"""
import os
import pytest
import requests
from pathlib import Path

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).resolve().parents[2] / "frontend" / ".env")
except Exception:
    pass

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
assert BASE_URL, "REACT_APP_BACKEND_URL must be set"

API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


SUMMARY_KEYS = {"id", "title", "theme", "gameType", "tone", "systemsCount",
                "assetsCount", "createdAt", "updatedAt"}


# --- Seed ---
class TestSeed:
    def test_seed_default_project_exists(self, client):
        r = client.get(f"{API}/projects")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        titles = [p["title"] for p in data]
        assert "Cursed Muffin Raccoons" in titles, f"Seed not found; titles={titles}"

    def test_summary_shape(self, client):
        data = client.get(f"{API}/projects").json()
        for p in data:
            assert SUMMARY_KEYS.issubset(set(p.keys())), f"Missing keys: {SUMMARY_KEYS - set(p.keys())}"
            assert "_id" not in p


# --- Full GET ---
class TestGetFull:
    def test_get_full_project(self, client):
        summaries = client.get(f"{API}/projects").json()
        seed = next(p for p in summaries if p["title"] == "Cursed Muffin Raccoons")
        r = client.get(f"{API}/projects/{seed['id']}")
        assert r.status_code == 200
        p = r.json()
        assert p["id"] == seed["id"]
        assert "concept" in p and "playground" in p and "assets" in p
        assert p["concept"]["title"] == "Cursed Muffin Raccoons"
        assert isinstance(p["concept"]["systems"], list)
        assert "Pets" in p["concept"]["systems"]
        assert p["playground"]["pgCrumbs"] == 0
        assert "_id" not in p

    def test_get_404(self, client):
        r = client.get(f"{API}/projects/does-not-exist")
        assert r.status_code == 404


# --- Create + Update + Duplicate + Delete lifecycle ---
class TestProjectLifecycle:
    created_ids: list = []

    def test_create_project(self, client):
        payload = {"title": "TEST_proj_A"}
        r = client.post(f"{API}/projects", json=payload)
        assert r.status_code == 200, r.text
        p = r.json()
        assert p["title"] == "TEST_proj_A"
        assert p["concept"]["title"] == "TEST_proj_A"
        assert "id" in p
        TestProjectLifecycle.created_ids.append(p["id"])

        # Verify persisted
        r2 = client.get(f"{API}/projects/{p['id']}")
        assert r2.status_code == 200
        assert r2.json()["title"] == "TEST_proj_A"

    def test_update_concept_with_systems(self, client):
        pid = TestProjectLifecycle.created_ids[0]
        # Build concept payload toggling systems
        get_resp = client.get(f"{API}/projects/{pid}").json()
        concept = get_resp["concept"]
        concept["systems"] = ["Pets", "Bosses"]
        concept["theme"] = "Haunted Forest"
        r = client.put(f"{API}/projects/{pid}", json={"concept": concept})
        assert r.status_code == 200, r.text
        # Verify via GET
        got = client.get(f"{API}/projects/{pid}").json()
        assert got["concept"]["systems"] == ["Pets", "Bosses"]
        assert got["concept"]["theme"] == "Haunted Forest"

    def test_update_title_also_updates_concept_title(self, client):
        pid = TestProjectLifecycle.created_ids[0]
        r = client.put(f"{API}/projects/{pid}", json={"title": "TEST_proj_A_renamed"})
        assert r.status_code == 200
        got = client.get(f"{API}/projects/{pid}").json()
        assert got["title"] == "TEST_proj_A_renamed"
        assert got["concept"]["title"] == "TEST_proj_A_renamed"

    def test_update_playground_roundtrip(self, client):
        pid = TestProjectLifecycle.created_ids[0]
        payload = {"playground": {"pgCrumbs": 12.5, "pgRaccoons": 3, "pgPerSec": 3.6, "ownedUpgrades": ["big-bowl"]}}
        r = client.put(f"{API}/projects/{pid}", json=payload)
        assert r.status_code == 200
        got = client.get(f"{API}/projects/{pid}").json()
        assert got["playground"]["pgRaccoons"] == 3
        assert abs(got["playground"]["pgPerSec"] - 3.6) < 1e-6
        assert got["playground"]["ownedUpgrades"] == ["big-bowl"]

    def test_update_assets_roundtrip(self, client):
        pid = TestProjectLifecycle.created_ids[0]
        b64 = "data:image/png;base64,XXXX"
        r = client.put(f"{API}/projects/{pid}", json={"assets": {"mascot": b64}})
        assert r.status_code == 200
        got = client.get(f"{API}/projects/{pid}").json()
        assert got["assets"].get("mascot") == b64
        # summary assetsCount = 1
        summaries = client.get(f"{API}/projects").json()
        s = next(x for x in summaries if x["id"] == pid)
        assert s["assetsCount"] == 1
        assert s["systemsCount"] == 2  # from earlier update

    def test_duplicate_project(self, client):
        pid = TestProjectLifecycle.created_ids[0]
        original = client.get(f"{API}/projects/{pid}").json()
        r = client.post(f"{API}/projects/{pid}/duplicate")
        assert r.status_code == 200, r.text
        copy = r.json()
        assert copy["id"] != pid
        assert copy["title"] == f"{original['title']} (copy)"
        # snapshot preserved
        assert copy["concept"]["systems"] == original["concept"]["systems"]
        assert copy["playground"]["pgPerSec"] == original["playground"]["pgPerSec"]
        assert copy["assets"] == original["assets"]
        TestProjectLifecycle.created_ids.append(copy["id"])

        # Original untouched (title)
        orig_after = client.get(f"{API}/projects/{pid}").json()
        assert orig_after["title"] == original["title"]

    def test_zzz_cleanup_created(self, client):
        # Delete all TEST_ created projects to keep DB clean
        for pid in TestProjectLifecycle.created_ids:
            r = client.delete(f"{API}/projects/{pid}")
            assert r.status_code == 200


# --- Delete & reseed ---
class TestDeleteReseed:
    def test_delete_all_triggers_reseed(self, client):
        # Snapshot all current projects, delete one by one
        summaries = client.get(f"{API}/projects").json()
        # Only delete TEST_ ones if any remain; then delete the rest including seed
        ids = [p["id"] for p in summaries]
        for pid in ids:
            r = client.delete(f"{API}/projects/{pid}")
            assert r.status_code == 200, f"delete {pid} -> {r.status_code} {r.text}"

        # After last delete, server should reseed default
        post = client.get(f"{API}/projects").json()
        assert len(post) >= 1, "Reseed did not happen"
        assert any(p["title"] == "Cursed Muffin Raccoons" for p in post), \
            f"Reseed missing default title; got {[p['title'] for p in post]}"
