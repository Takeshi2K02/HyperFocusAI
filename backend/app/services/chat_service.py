from app.db import mongo_service
from app.models.chat_model import Chat, Message
from bson import ObjectId
from app.services.nlu_service import generate_chat_response  # ✅ Import Gemini API function
from datetime import datetime

# ✅ Get Database Collections
chats_collection = mongo_service.chats_collection
messages_collection = mongo_service.messages_collection

def get_or_create_chat(user_id, title="New Chat"):
    """Create a new chat only when the user sends a message for the first time."""
    
    # ✅ Do NOT return the latest chat; always create a new one
    chat_obj = Chat(user_id=user_id, title=title)
    result = chats_collection.insert_one(chat_obj.to_dict())
    
    return str(result.inserted_id)  # ✅ Return the new chat ID

def get_user_chats(user_id):
    """Retrieve all chat sessions for a user."""
    chats = list(chats_collection.find({"user_id": user_id, "is_deleted": {"$ne": True}}))
    for chat in chats:
        chat["_id"] = str(chat["_id"])
    return chats

def delete_chat(chat_id):
    """Soft delete a chat session."""
    result = chats_collection.update_one(
        {"_id": ObjectId(chat_id)},
        {"$set": {"is_deleted": True, "updated_at": datetime.utcnow().isoformat()}}
    )
    return result.modified_count > 0  # Returns True if deleted

def store_message(chat_id, role, content, token_count=0):
    """Store both user and assistant messages in an existing chat session."""

    message = Message(chat_id=chat_id, role=role, content=content, token_count=token_count)
    result = messages_collection.insert_one(message.to_dict())
    message_id = str(result.inserted_id)

    # ✅ Call Gemini API for an assistant response
    if role == "user":
        assistant_reply = generate_chat_response(content)  # ✅ Get real AI response

        assistant_message = Message(chat_id=chat_id, role="assistant", content=assistant_reply)
        assistant_result = messages_collection.insert_one(assistant_message.to_dict())
        assistant_message_id = str(assistant_result.inserted_id)

        # ✅ Update chat with both user and assistant messages
        chats_collection.update_one(
            {"_id": ObjectId(chat_id)},
            {"$push": {"messages": {"$each": [message_id, assistant_message_id]}},
             "$set": {"updated_at": datetime.utcnow().isoformat()}}
        )
    else:
        # ✅ If it's already an assistant message, just update normally
        chats_collection.update_one(
            {"_id": ObjectId(chat_id)},
            {"$push": {"messages": message_id},
             "$set": {"updated_at": datetime.utcnow().isoformat()}}
        )

    return message_id  # ✅ Only return the user message ID

def get_chat_messages(chat_id):
    """Retrieve all messages within a chat session."""
    messages = list(messages_collection.find({"chat_id": chat_id}))
    for msg in messages:
        msg["_id"] = str(msg["_id"])
    return messages