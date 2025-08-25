# Movie Recommender System

An AI-powered movie recommendation system using PyTorch and React, deployable on GitHub Pages.

## Features
- Deep learning-based collaborative filtering
- Interactive web interface
- Optimized training process
- MLOps integration with MLflow

## Setup Instructions

1. Create virtual environment:
```bash
python -m venv venv
source venv/Scripts/activate  # Windows
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Download MovieLens 32M dataset from [here](https://grouplens.org/datasets/movielens/25m/) and extract to a `ml-32m/` directory outside the project folder.

4. Train the model:
```bash
python train.py
```

## Project Structure
- `model/` - Contains the PyTorch model implementation
- `frontend/` - React-based web interface
- `train.py` - Training script for the recommendation model

## GitHub Pages Deployment
The web interface is automatically deployed to GitHub Pages via GitHub Actions.

## Required Data Files
Place these files in the `ml-32m/` directory in the parent folder of the project:
- movies.csv
- ratings.csv

## Note
The `ml-32m` dataset directory and `venv` virtual environment are not included in the repository.
