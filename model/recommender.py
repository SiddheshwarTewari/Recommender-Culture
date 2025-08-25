import torch
import torch.nn as nn
import torch.nn.functional as F
import json
import os

class MovieRecommender(nn.Module):
    def __init__(self, num_users, num_movies, embedding_dim=100):
        super(MovieRecommender, self).__init__()
        print(f"Initializing embeddings with {num_users} users and {num_movies} movies")
        self.user_embeddings = nn.Embedding(num_users, embedding_dim)
        self.movie_embeddings = nn.Embedding(num_movies, embedding_dim)
        
        self.fc1 = nn.Linear(embedding_dim * 2, 128)
        self.fc2 = nn.Linear(128, 64)
        self.fc3 = nn.Linear(64, 1)
        
        self.dropout = nn.Dropout(0.2)
        
    def forward(self, user_ids, movie_ids):
        user_embeds = self.user_embeddings(user_ids)
        movie_embeds = self.movie_embeddings(movie_ids)
        
        x = torch.cat([user_embeds, movie_embeds], dim=-1)
        x = F.relu(self.fc1(x))
        x = self.dropout(x)
        x = F.relu(self.fc2(x))
        x = self.dropout(x)
        x = self.fc3(x)
        
        return torch.sigmoid(x)
    
    def generate_static_recommendations(self, user_range, movies_data, output_dir, user_mapping, movie_mapping):
        """Generate static recommendations with mapped IDs"""
        self.eval()
        recommendations = {}
        device = next(self.parameters()).device
        
        # Create reverse mappings
        reverse_movie_mapping = {v: k for k, v in movie_mapping.items()}
        
        with torch.no_grad():
            for mapped_user_id in range(min(user_range, len(user_mapping))):
                movie_ids = torch.arange(len(movie_mapping), device=device)
                user_ids = torch.full_like(movie_ids, mapped_user_id)
                scores = self.forward(user_ids, movie_ids).squeeze()
                
                # Get top k recommendations (k = min(20, number of available movies))
                k = min(20, len(movie_mapping))
                top_scores, top_indices = torch.topk(scores, k)
                
                original_user_id = list(user_mapping.keys())[mapped_user_id]
                recommendations[str(original_user_id)] = [
                    {
                        "id": int(reverse_movie_mapping[idx.item()]),
                        "title": next((m["title"] for m in movies_data if m["movieId"] == reverse_movie_mapping[idx.item()]), "Unknown"),
                        "score": float(score.item())  # Convert to float for JSON serialization
                    }
                    for score, idx in zip(top_scores, top_indices)
                    if score.item() > 0  # Only include positive scores
                ]
        
        os.makedirs(output_dir, exist_ok=True)
        with open(os.path.join(output_dir, 'recommendations.json'), 'w') as f:
            json.dump(recommendations, f)
