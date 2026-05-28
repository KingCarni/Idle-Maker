"""Idle Maker backend API tests.

Covers:
- /api/health
- /api/mock-data (concept/currencies/generators/exportPlan structure)
- /api/status POST + GET persistence
"""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://76773b65-9308-400a-af01-0d7eed307e0e.preview.emergentagent.com").rstrip("/")


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --- Health ---
class TestHealth:
    def test_root_api(self, client):
        r = client.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        data = r.json()
        assert "message" in data
        assert "Idle Maker" in data["message"]

    def test_health(self, client):
        r = client.get(f"{BASE_URL}/api/health")
        assert r.status_code == 200
        data = r.json()
        assert data.get("status") == "ok"
        assert data.get("service") == "idle-maker"


# --- Mock data ---
class TestMockData:
    def test_mock_data_status(self, client):
        r = client.get(f"{BASE_URL}/api/mock-data")
        assert r.status_code == 200

    def test_mock_data_concept(self, client):
        data = client.get(f"{BASE_URL}/api/mock-data").json()
        assert "concept" in data
        c = data["concept"]
        for k in ["title", "theme", "gameType", "coreFantasy", "mainAction",
                  "progressionStyle", "currencyModel", "systems", "tone", "freeText"]:
            assert k in c, f"missing concept key: {k}"
        assert isinstance(c["systems"], list)
        assert c["title"] == "Cursed Muffin Raccoons"

    def test_mock_data_currencies(self, client):
        data = client.get(f"{BASE_URL}/api/mock-data").json()
        currs = data["currencies"]
        assert isinstance(currs, list) and len(currs) == 3
        ids = {c["id"] for c in currs}
        assert ids == {"crumbs", "sugar-stars", "golden-muffins"}
        for c in currs:
            for k in ["id", "name", "symbol", "tier"]:
                assert k in c

    def test_mock_data_generators(self, client):
        data = client.get(f"{BASE_URL}/api/mock-data").json()
        gens = data["generators"]
        assert isinstance(gens, list) and len(gens) == 5
        ids = {g["id"] for g in gens}
        assert "raccoon-baker" in ids
        for g in gens:
            assert isinstance(g["baseCost"], (int, float))
            assert isinstance(g["rate"], (int, float))

    def test_mock_data_export_plan(self, client):
        data = client.get(f"{BASE_URL}/api/mock-data").json()
        ep = data["exportPlan"]
        assert isinstance(ep, list) and len(ep) == 7
        for e in ep:
            for k in ["id", "title", "status"]:
                assert k in e


# --- Status CRUD with persistence verification ---
class TestStatusCRUD:
    def test_create_status_and_persist(self, client):
        payload = {"client_name": "TEST_idle_maker_agent"}
        r = client.post(f"{BASE_URL}/api/status", json=payload)
        assert r.status_code == 200
        data = r.json()
        assert data["client_name"] == "TEST_idle_maker_agent"
        assert "id" in data and isinstance(data["id"], str)
        assert "timestamp" in data

        # GET list and verify persistence
        r2 = client.get(f"{BASE_URL}/api/status")
        assert r2.status_code == 200
        listed = r2.json()
        assert isinstance(listed, list)
        # Ensure our entry exists & no _id leaks
        found = [x for x in listed if x.get("client_name") == "TEST_idle_maker_agent"]
        assert len(found) >= 1
        for x in listed:
            assert "_id" not in x
