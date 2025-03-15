from app.db import mongo_service
from app.models.chat_model import Chat, Message
from bson import ObjectId
from app.services.nlu_service import generate_chat_response  # ✅ Import Gemini API function
from datetime import datetime
from app.services.nlu_service import generate_chat_title  # ✅ Import title generator

# ✅ Get Database Collections
chats_collection = mongo_service.chats_collection
messages_collection = mongo_service.messages_collection

def get_or_create_chat(user_id, title="New Chat"):
    """Create a new chat but allow title updates later."""
    
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



def store_message(chat_id, role, content, token_count=0, parent_message_id=None):
    """Store both user and assistant messages in an existing chat session."""

    print(f"📝 Storing message - Chat ID: {chat_id}, Role: {role}, Content: {content}")

    message = Message(chat_id=chat_id, role=role, content=content, token_count=token_count, parent_message_id=parent_message_id)
    result = messages_collection.insert_one(message.to_dict())
    message_id = str(result.inserted_id)  # ✅ Store the generated _id

    chat = chats_collection.find_one({"_id": ObjectId(chat_id)})

    if not chat:
        print(f"⚠️ Chat not found: {chat_id}")
        return {"message_id": message_id}  # ✅ Ensure message_id is returned

    # ✅ Step 1: Generate AI response if user sends message
    if role == "user":
        print("⚡ Calling AI for response...")
        assistant_reply = generate_chat_response(content)

        if assistant_reply:
            print(f"🤖 AI Response Received: {assistant_reply}")
            assistant_message = Message(chat_id=chat_id, role="assistant", content=assistant_reply, parent_message_id=message_id)  # ✅ Link AI response to user message
            assistant_result = messages_collection.insert_one(assistant_message.to_dict())
            assistant_message_id = str(assistant_result.inserted_id)

            # ✅ Step 2: Update chat with both user & AI messages
            chats_collection.update_one(
                {"_id": ObjectId(chat_id)},
                {
                    "$push": {"messages": {"$each": [message_id, assistant_message_id]}},
                    "$set": {"updated_at": datetime.utcnow().isoformat()}
                }
            )
        else:
            print("⚠️ AI did not return a response!")
            chats_collection.update_one(
                {"_id": ObjectId(chat_id)},
                {
                    "$push": {"messages": message_id},
                    "$set": {"updated_at": datetime.utcnow().isoformat()}
                }
            )

        # ✅ Step 3: Set AI-generated title if this is the first message
        if chat.get("title") == "New Chat":
            print("🎯 Generating AI Title...")
            new_title = generate_chat_title(content)
            if new_title:
                chats_collection.update_one(
                    {"_id": ObjectId(chat_id)},
                    {"$set": {"title": new_title}}
                )
                print(f"✅ Chat title updated: {new_title}")
            else:
                print("⚠️ AI failed to generate a title!")

    else:
        # ✅ Assistant message already exists
        chats_collection.update_one(
            {"_id": ObjectId(chat_id)},
            {
                "$push": {"messages": message_id},
                "$set": {"updated_at": datetime.utcnow().isoformat()}
            }
        )

    return {"message_id": message_id}  # ✅ Ensure message_id is returned

def get_chat_messages(chat_id):
    """Retrieve all messages within a chat session."""
    messages = list(messages_collection.find({"chat_id": chat_id}))
    
    # ✅ Ensure each message includes `_id` as a string
    for msg in messages:
        msg["_id"] = str(msg["_id"])  # ✅ Convert ObjectId to string
    
    return messages

def rename_chat(chat_id, new_title):
    """Rename an existing chat by updating its title."""
    result = chats_collection.update_one(
        {"_id": ObjectId(chat_id)},
        {"$set": {"title": new_title, "updated_at": datetime.utcnow().isoformat()}}
    )
    return result.modified_count > 0  # ✅ Returns True if update was successful

def delete_chat(chat_id):
    """Delete a chat and all its related messages."""
    # ✅ Step 1: Delete messages linked to this chat
    messages_result = messages_collection.delete_many({"chat_id": chat_id})
    
    # ✅ Step 2: Delete the chat itself
    chat_result = chats_collection.delete_one({"_id": ObjectId(chat_id)})

    # ✅ Return True only if the chat was deleted
    return chat_result.deleted_count > 0

def delete_message(message_id):
    """Delete a message and all related messages below it."""
    try:
        # ✅ Step 1: Find the message
        message = messages_collection.find_one({"_id": ObjectId(message_id)})
        if not message:
            return {"error": "Message not found"}, 404

        chat_id = message["chat_id"]
        timestamp = message["timestamp"]  # ✅ Get the timestamp of the message

        # ✅ Step 2: Delete all messages in this chat that have a later timestamp
        deleted_result = messages_collection.delete_many({
            "chat_id": chat_id,
            "timestamp": {"$gte": timestamp}  # ✅ Deletes this message and all below it
        })

        return {
            "message": "Message and all messages below it deleted",
            "deleted_count": deleted_result.deleted_count
        }, 200

    except Exception as e:
        return {"error": str(e)}, 500