import sys
import os

# Add backend directory to sys.path so that 'app' module can be found
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from backend.app.main import app
