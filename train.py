import torch
import pandas as pd
from torch.utils.data import DataLoader, Dataset
from model.recommender import MovieRecommender
import mlflow
from tqdm import tqdm
import numpy as np
import os

class MovieDataset(Dataset):
    def __init__(self, ratings_file, max_samples=100000):  # Limit samples
        # Load only a subset of data for faster training
        self.ratings = pd.read_csv(ratings_file, nrows=max_samples)
        self.user_mapping = {id_: idx for idx, id_ in enumerate(self.ratings['userId'].unique())}
        self.movie_mapping = {id_: idx for idx, id_ in enumerate(self.ratings['movieId'].unique())}
        
    def __len__(self):
        return len(self.ratings)
        
    def __getitem__(self, idx):
        row = self.ratings.iloc[idx]
        return {
            'user_id': torch.tensor(self.user_mapping[row.userId], dtype=torch.long),
            'movie_id': torch.tensor(self.movie_mapping[row.movieId], dtype=torch.long),
            'rating': torch.tensor(row.rating, dtype=torch.float)
        }

def train_model():
    # Check if dataset exists in parent directory
    dataset_dir = os.path.abspath('../ml-32m')
    if not os.path.exists(dataset_dir):
        raise FileNotFoundError(f"Dataset directory not found at {dataset_dir}. Please place the ml-32m folder outside the project directory.")
    
    # Force CPU usage and single thread for stability
    torch.set_num_threads(1)
    device = torch.device('cpu')
    print(f"Using device: {device}")
    
    # Create necessary directories
    os.makedirs("model", exist_ok=True)
    os.makedirs("frontend/public/data", exist_ok=True)
    
    mlflow.set_experiment("movie-recommender")
    with mlflow.start_run():
        # Use absolute paths for dataset
        movies_df = pd.read_csv(os.path.join(dataset_dir, 'movies.csv'))
        movies_data = movies_df.to_dict('records')
        
        # Load ratings data with absolute path
        dataset = MovieDataset(os.path.join(dataset_dir, 'ratings.csv'), max_samples=100000)
        num_users = len(dataset.user_mapping)
        num_movies = len(dataset.movie_mapping)
        print(f"Number of users: {num_users}, Number of movies: {num_movies}")
        
        try:
            # Reduce batch size for better memory management
            dataloader = DataLoader(dataset, batch_size=2048, shuffle=True, num_workers=0)
            
            model = MovieRecommender(num_users=num_users, num_movies=num_movies)
            model = model.to(device)
            optimizer = torch.optim.Adam(model.parameters(), lr=0.01)  # Increased learning rate
            criterion = torch.nn.MSELoss()
            
            best_loss = float('inf')
            patience = 3
            patience_counter = 0
            
            for epoch in range(10):
                model.train()
                total_loss = 0
                progress_bar = tqdm(dataloader, desc=f'Epoch {epoch+1}')
                
                for batch in progress_bar:
                    # Move batch to device
                    user_ids = batch['user_id'].to(device)
                    movie_ids = batch['movie_id'].to(device)
                    ratings = batch['rating'].to(device)
                    
                    optimizer.zero_grad()
                    predictions = model(user_ids, movie_ids)
                    loss = criterion(predictions.squeeze(), ratings)
                    loss.backward()
                    optimizer.step()
                    total_loss += loss.item()
                    
                    progress_bar.set_postfix({'loss': loss.item()})
                
                avg_loss = total_loss / len(dataloader)
                mlflow.log_metric("loss", avg_loss, step=epoch)
                
                # Early stopping
                if avg_loss < best_loss:
                    best_loss = avg_loss
                    torch.save(model.state_dict(), "model/saved_model.pt")
                    patience_counter = 0
                else:
                    patience_counter += 1
                    if patience_counter >= patience:
                        print("Early stopping triggered")
                        break
            
            torch.save(model.state_dict(), "model/saved_model.pt")
            mlflow.pytorch.log_model(model, "model")

            # Generate static recommendations with proper parameters
            print("Generating static recommendations...")
            try:
                model.generate_static_recommendations(
                    user_range=min(1000, len(dataset.user_mapping)),  # Ensure user_range doesn't exceed available users
                    movies_data=movies_data,
                    output_dir='frontend/public/data',
                    user_mapping=dataset.user_mapping,
                    movie_mapping=dataset.movie_mapping
                )
                print("Recommendations generated successfully!")
            except Exception as e:
                print(f"Error generating recommendations: {str(e)}")
                
        except Exception as e:
            print(f"Error during training: {str(e)}")
            raise

        print("Training complete and static recommendations generated!")

        # Add verification after training
        try:
            rec_file = os.path.join('frontend/public/data', 'recommendations.json')
            model_file = "model/saved_model.pt"
            
            if os.path.exists(rec_file) and os.path.exists(model_file):
                rec_size = os.path.getsize(rec_file) / (1024 * 1024)  # Size in MB
                print(f"\nVerification:\n- Recommendations file size: {rec_size:.2f}MB")
                print(f"- Model file saved successfully")
            else:
                print("Warning: Some output files are missing!")
        except Exception as e:
            print(f"Error during verification: {str(e)}")

    return True  # Indicate successful training

if __name__ == "__main__":
    train_model()
