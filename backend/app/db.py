from pymongo import MongoClient
from app.config import Config

class MongoService:
    def __init__(self):
        """Initialize MongoDB Connection"""
        self.client = MongoClient(Config.MONGO_URI)  # Direct connection
        self.db = self.client["HyperFocusDB"]  # Select Database

        # ✅ Collections
        self.tasks_collection = self.db["tasks"]
        self.chats_collection = self.db["chats"]  # Stores chat sessions
        self.messages_collection = self.db["messages"]  # Stores chat messages

    def get_db(self):
        """Return the database instance"""
        return self.db

# ✅ Create a Singleton Instance of MongoService
mongo_service = MongoService()
