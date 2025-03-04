from datetime import datetime

class Chat:
    def __init__(self, user_id, title, created_at=None, updated_at=None, messages=None):
        self.user_id = user_id  # Temporary user ID (Replaceable with real ID later)
        self.title = title  # Chat title
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()
        self.messages = messages or []  # Store full message objects instead of just IDs

    def to_dict(self):
        """Convert Chat object to dictionary format for MongoDB"""
        return {
            "user_id": self.user_id,
            "title": self.title,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "messages": self.messages  # Store full messages instead of only IDs
        }


class Message:
    def __init__(self, chat_id, role, content, timestamp=None, token_count=0):
        self.chat_id = chat_id  # ✅ Store chat ID
        self.role = role  # "user" or "assistant"
        self.content = content  # Message text
        self.timestamp = timestamp or datetime.utcnow()
        self.token_count = token_count  # Token usage (useful for managing context)

    def to_dict(self):
        """Convert Message object to dictionary format for MongoDB"""
        return {
            "chat_id": self.chat_id,  # ✅ Ensure chat ID is included
            "role": self.role,
            "content": self.content,
            "timestamp": self.timestamp.isoformat(),
            "token_count": self.token_count,
        }