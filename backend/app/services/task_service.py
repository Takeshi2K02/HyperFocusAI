from app.db import mongo_service
from app.models.task_model import Task
from bson import ObjectId
from datetime import datetime

# ✅ Get Database Collection
tasks_collection = mongo_service.tasks_collection

def add_task_to_db(task_data):
    """Add a new task to MongoDB"""
    task = Task(**task_data)  # Create Task instance
    result = tasks_collection.insert_one(task.to_dict())  # Insert into MongoDB
    return str(result.inserted_id)  # Return inserted ID

def get_all_tasks():
    """Retrieve all tasks"""
    tasks = list(tasks_collection.find())
    for task in tasks:
        task["_id"] = str(task["_id"])  # Convert ObjectId to string
    return tasks

def get_task_by_id(task_id):
    """Retrieve a single task"""
    task = tasks_collection.find_one({"_id": ObjectId(task_id)})
    if task:
        task["_id"] = str(task["_id"])
    return task

def update_task(task_id, update_data):
    """Update an existing task"""
    update_data["updated_at"] = datetime.utcnow().isoformat()
    result = tasks_collection.update_one({"_id": ObjectId(task_id)}, {"$set": update_data})
    return result.modified_count > 0  # Returns True if update was successful

def delete_task(task_id):
    """Delete a task"""
    result = tasks_collection.delete_one({"_id": ObjectId(task_id)})
    return result.deleted_count > 0  # Returns True if delete was successful