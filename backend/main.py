from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
from pydantic import BaseModel
import requests, os
from uuid import uuid4
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

YELP_API_KEY = os.getenv("YELP_API_KEY")
YELP_API_URL = "https://api.yelp.com/v3/businesses/search"

boards = {}

class RestaurantPin(BaseModel):
    business_id: str
    name: str
    url: str
    image_url: str

class VoteInput(BaseModel):
    business_id: str
    vote: str  # "yes", "no", "maybe"

class CreateBoardInput(BaseModel):
    event_name: str
    date: str
    created_by: str

@app.get("/recommendations")
def get_recommendations(
    meeting_type: str = "team_lunch",
    cuisine: str = Query("restaurants"),
    location: str = Query("Toronto"),
    sort_by: str = Query("best_match"),
    price: str = Query(""),
    radius: int = Query(2000),
    limit: int = Query(6)
):
    headers = {"Authorization": f"Bearer {YELP_API_KEY}"}
    params = {
        "term": cuisine,
        "location": location,
        "sort_by": sort_by,
        "limit": limit,
        "radius": radius,
    }
    if price:
        params["price"] = price

    response = requests.get(YELP_API_URL, headers=headers, params=params)
    if response.status_code != 200:
        return {"error": response.json()}

    return response.json()

@app.post("/boards/create")
def create_board(board: CreateBoardInput):
    board_id = str(uuid4())
    boards[board_id] = {
        "meta": {
            "id": board_id,
            "eventName": board.event_name,
            "date": board.date,
            "createdBy": board.created_by,
        },
        "pins": [],
        "votes": {}
    }
    return boards[board_id]["meta"]

@app.get("/boards")
def list_boards():
    return [b["meta"] for b in boards.values()]

@app.get("/boards/{board_id}")
def get_board(board_id: str):
    if board_id not in boards:
        raise HTTPException(status_code=404, detail="Board not found")
    return {
        "meta": boards[board_id]["meta"],
        "pins": boards[board_id]["pins"],
        "votes": boards[board_id]["votes"]
    }

@app.post("/boards/{board_id}/pin")
def pin_restaurant(board_id: str, restaurant: RestaurantPin):
    if board_id not in boards:
        raise HTTPException(status_code=404, detail="Board not found")
    board = boards[board_id]
    if any(r["business_id"] == restaurant.business_id for r in board["pins"]):
        return {"message": "Already pinned."}
    board["pins"].append(restaurant.dict())
    board["votes"][restaurant.business_id] = {"yes": 0, "no": 0, "maybe": 0}
    return {"message": f"Pinned to board '{board_id}'."}

@app.post("/boards/{board_id}/vote")
def vote_restaurant(board_id: str, vote_input: VoteInput):
    board = boards.get(board_id)
    if not board or vote_input.business_id not in board["votes"]:
        raise HTTPException(status_code=400, detail="Invalid board or restaurant")
    if vote_input.vote not in ["yes", "no", "maybe"]:
        raise HTTPException(status_code=400, detail="Invalid vote")
    board["votes"][vote_input.business_id][vote_input.vote] += 1
    return {"message": f"Vote '{vote_input.vote}' recorded."}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
