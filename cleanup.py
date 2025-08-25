import os
import shutil
import subprocess

def cleanup():
    # Deactivate virtual environment if active
    if 'VIRTUAL_ENV' in os.environ:
        if os.name == 'nt':  # Windows
            subprocess.run(['deactivate'], shell=True)
        else:
            print("Please run 'deactivate' manually after script completion")

    # Directories to remove
    dirs_to_remove = [
        'venv',
        '__pycache__',
        'mlruns',
        'model/__pycache__',
        'frontend/node_modules',
        'frontend/build',
        'frontend/public/data',
        '.pytest_cache',
        '.coverage',
        'dist',
        'build',
        'model/saved_model.pt',
        '.git'
    ]

    # Remove directories
    for dir_path in dirs_to_remove:
        full_path = os.path.join(os.path.dirname(__file__), dir_path)
        if os.path.exists(full_path):
            print(f"Removing {full_path}")
            try:
                if os.path.isfile(full_path):
                    os.remove(full_path)
                else:
                    shutil.rmtree(full_path)
            except Exception as e:
                print(f"Error removing {full_path}: {e}")

    print("\nCleanup complete! To start fresh:")
    print("1. Create new virtual environment: python -m venv venv")
    print("2. Activate it: source venv/Scripts/activate (Git Bash) or venv\\Scripts\\activate (CMD)")
    print("3. Install requirements: pip install -r requirements.txt")

if __name__ == "__main__":
    cleanup()
