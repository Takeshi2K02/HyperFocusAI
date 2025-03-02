from datetime import datetime

class Task:
    def __init__(self, title, description="", status="pending", priority="medium", due_date=None):
        self.title = title
        self.description = description
        self.status = status  # pending, in_progress, completed
        self.priority = priority  # low, medium, high
        self.due_date = due_date
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def to_dict(self):
        """Convert Task object to dictionary format for MongoDB"""
        return {
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "priority": self.priority,
            "due_date": self.due_date,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }