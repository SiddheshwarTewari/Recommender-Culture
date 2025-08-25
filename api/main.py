from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import torch
from model.recommender import MovieRecommender

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = MovieRecommender(num_users=10000, num_movies=50000)
model.load_state_dict(torch.load("model/saved_model.pt"))
model.eval()

@app.get("/recommend/{user_id}")
async def get_recommendations(user_id: int):
    with torch.no_grad():
        # Get top 10 recommendations for user
        predictions = []
        # Implementation of prediction logic here
        return {"recommendations": predictions}
