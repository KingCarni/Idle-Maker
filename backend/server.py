from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Configure logging early so route handlers can use `logger`.
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger("idle-maker")

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


# ---- Asset generation (Gemini Nano Banana via Emergent LLM key) ----

class AssetGenerateRequest(BaseModel):
    slotId: str
    label: str
    prompt: str
    conceptTitle: Optional[str] = None
    conceptTheme: Optional[str] = None
    conceptTone: Optional[str] = None


# Per-slot style guidance to keep aesthetic consistent across the Asset Kit
SLOT_STYLE: dict[str, str] = {
    "moodboard": "a 2x2 moodboard collage of small vignettes on warm cream paper, doodled with soft ink lines",
    "mascot": "single hero/mascot character portrait, full body, friendly stance, centered on warm paper",
    "pet-1": "tiny cute creature concept doodle, side-view, hand-drawn in soft ink on warm paper",
    "pet-2": "small whimsical pet concept doodle, three-quarter view, hand-drawn in soft ink on warm paper",
    "enemy": "two or three small mischievous enemy concepts arranged like sketchbook entries on warm paper",
    "boss": "imposing but charming boss creature portrait, dramatic pose, ink and watercolor wash on warm paper",
    "currency": "a row of three small currency icons (soft, hard, prestige) drawn as coin/sticker stamps on warm paper",
    "upgrades": "a grid of four small upgrade icon stickers, hand-drawn ink on warm paper, label-free",
    "zone": "small isometric environment / zone concept illustration in soft ink and gentle watercolor on warm paper",
    "ui": "a tiny mock UI panel sketch showing buttons, sliders, and a card, drawn in ink on warm paper",
}

STYLE_SUFFIX = (
    "Cozy hand-drawn sketchbook style. Warm cream paper background (#F8F1DF), soft ink outlines, "
    "light watercolor washes, gentle dot-grid hints, slightly imperfect lines. Indie creator notebook aesthetic. "
    "Do NOT include any text, labels, captions, watermarks or logos. Center the subject with breathing room."
)


def _build_prompt(req: AssetGenerateRequest) -> str:
    slot_hint = SLOT_STYLE.get(req.slotId, req.label)
    bits = [
        f"Generate a {slot_hint}.",
        f"Subject: {req.prompt.strip()}." if req.prompt and req.prompt.strip() else "",
    ]
    if req.conceptTitle:
        bits.append(f"Game: \"{req.conceptTitle}\".")
    if req.conceptTheme:
        bits.append(f"Theme: {req.conceptTheme}.")
    if req.conceptTone:
        bits.append(f"Tone: {req.conceptTone}.")
    bits.append(STYLE_SUFFIX)
    return " ".join(b for b in bits if b)


@api_router.post("/assets/generate")
async def generate_asset(req: AssetGenerateRequest):
    """Generate a sketchbook-styled asset image via Gemini Nano Banana.
    Returns {image: 'data:image/png;base64,...', mime, prompt, model}."""
    api_key = os.environ.get("EMERGENT_LLM_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="EMERGENT_LLM_KEY not configured")

    # Import lazily so unrelated routes don't fail if the integration lib has issues.
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage  # type: ignore
    except Exception as e:
        logger.exception("emergentintegrations import failed")
        raise HTTPException(status_code=500, detail=f"Integration unavailable: {e}")

    full_prompt = _build_prompt(req)
    model_id = "gemini-3.1-flash-image-preview"

    try:
        chat = LlmChat(
            api_key=api_key,
            session_id=f"idle-maker-asset-{req.slotId}-{uuid.uuid4().hex[:8]}",
            system_message=(
                "You generate small illustrations for a cozy sketchbook-themed game design tool. "
                "Always honor the requested style cues. Never add text or watermarks."
            ),
        )
        chat.with_model("gemini", model_id).with_params(modalities=["image", "text"])

        msg = UserMessage(text=full_prompt)
        text, images = await chat.send_message_multimodal_response(msg)
    except Exception as e:
        logger.exception("Gemini image generation failed")
        raise HTTPException(status_code=502, detail=f"Image generation failed: {e}")

    if not images:
        # Log only the text length, not the full response
        logger.warning("Nano Banana returned no images. text_len=%d", len(text or ""))
        raise HTTPException(status_code=502, detail="No image was returned by the model")

    img = images[0]
    mime = img.get("mime_type") or "image/png"
    data_b64 = img.get("data") or ""
    # NEVER log the full b64; only a tiny prefix for debugging
    logger.info(
        "Generated asset for slot=%s prompt_len=%d image_prefix=%s...",
        req.slotId, len(full_prompt), (data_b64[:10] if data_b64 else "<empty>")
    )

    return {
        "image": f"data:{mime};base64,{data_b64}",
        "mime": mime,
        "model": model_id,
        "slotId": req.slotId,
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()