from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Idle Maker API — Sketchbook Studio"}


@api_router.get("/health")
async def health():
    return {"status": "ok", "service": "idle-maker"}


@api_router.get("/mock-data")
async def mock_data():
    """Returns the sample 'Cursed Muffin Raccoons' mock game so the frontend
    can later toggle between local and server-backed data."""
    return {
        "concept": {
            "title": "Cursed Muffin Raccoons",
            "theme": "Cozy Bakery",
            "gameType": "Absurd / comedy idle",
            "coreFantasy": "Run a chaotic but loveable business",
            "mainAction": "Bake",
            "progressionStyle": "Prestige loops",
            "currencyModel": "Soft + Hard + Prestige",
            "systems": ["Pets", "Bosses", "Achievements", "Prestige", "Offline earnings"],
            "tone": "Wholesome chaos",
            "freeText": (
                "A cozy absurd idle game where raccoons run a magical bakery, "
                "automate cursed muffin production, hire woodland helpers, "
                "battle pastry ghosts, and prestige into Golden Muffins."
            ),
        },
        "currencies": [
            {"id": "crumbs", "name": "Crumbs", "symbol": "◍", "tier": "soft"},
            {"id": "sugar-stars", "name": "Sugar Stars", "symbol": "✦", "tier": "hard"},
            {"id": "golden-muffins", "name": "Golden Muffins", "symbol": "✺", "tier": "prestige"},
        ],
        "generators": [
            {"id": "raccoon-baker", "name": "Raccoon Baker", "baseCost": 15, "rate": 1.2},
            {"id": "haunted-oven", "name": "Haunted Oven", "baseCost": 220, "rate": 9.0},
            {"id": "sprinkle-mixer", "name": "Sprinkle Mixer", "baseCost": 5, "rate": 0.4},
            {"id": "moonlit-cart", "name": "Moonlit Delivery Cart", "baseCost": 3400, "rate": 110.0},
            {"id": "elderberry-book", "name": "Elderberry Recipe Book", "baseCost": 80, "rate": 2.5},
        ],
        "exportPlan": [
            {"id": "design-doc", "title": "Design Doc", "status": "Mock only"},
            {"id": "json-config", "title": "JSON Config", "status": "Ready later"},
            {"id": "browser-proto", "title": "Browser Prototype", "status": "Mock only"},
            {"id": "godot", "title": "Godot Starter", "status": "Planned"},
            {"id": "unity", "title": "Unity Starter", "status": "Planned"},
            {"id": "unreal", "title": "Unreal Research", "status": "Planned"},
            {"id": "asset-pack", "title": "Asset Pack", "status": "Mock only"},
        ],
    }

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()