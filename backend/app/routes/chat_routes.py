from flask import Blueprint, request, jsonify
from app.services.chat_service import (
    get_or_create_chat,
    delete_chat,
    store_message,
    get_chat_messages,
    get_user_chats
)

chat_bp = Blueprint("chat", __name__, url_prefix="/chat")

# ✅ Retrieve all chat sessions for a user (Only titles for sidebar)
@chat_bp.route("/<user_id>", methods=["GET"])
def fetch_user_chats(user_id):
    """Fetch all chat titles for a specific user."""
    print(f"📡 Fetching chats for user: {user_id}")  # ✅ Debugging

    chats = get_user_chats(user_id)

    if not chats:
        print("⚠️ No chats found!")  # ✅ Debugging
        return jsonify({"chats": []}), 200  # ✅ Ensure response is always an array

    formatted_chats = [{"chat_id": str(chat["_id"]), "title": chat["title"]} for chat in chats]
    
    print(f"✅ Found {len(formatted_chats)} chats")  # ✅ Debugging
    return jsonify({"chats": formatted_chats}), 200

# ✅ Retrieve messages from a specific chat (Fixed route)
@chat_bp.route("/messages/<chat_id>", methods=["GET"])
def fetch_chat_messages(chat_id):
    """Fetch all messages for a given chat, sorted by timestamp."""
    print(f"📡 Fetching messages for chat: {chat_id}")  # ✅ Debugging

    messages = get_chat_messages(chat_id)

    if not messages:
        print("⚠️ No messages found!")  # ✅ Debugging
        return jsonify({"chat_id": chat_id, "messages": []}), 200  # ✅ Ensure response is always an array

    formatted_messages = [
        {
            "message_id": str(msg["_id"]),
            "content": msg["content"],
            "role": msg["role"],
            "timestamp": msg["timestamp"]
        }
        for msg in messages
    ]

    print(f"✅ Found {len(formatted_messages)} messages")  # ✅ Debugging
    return jsonify({"chat_id": chat_id, "messages": formatted_messages}), 200

@chat_bp.route("/message", methods=["POST"])
def send_message():
    data = request.json
    user_id = data.get("user_id")
    chat_id = data.get("chat_id", None)  # Can be None for a new chat
    role = data.get("role", "user")
    content = data.get("content", "")

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    # ✅ If no chat_id, create new chat first
    if not chat_id:
        chat_id = get_or_create_chat(user_id)

    # ✅ Store message and update title if it's the first message
    message_id = store_message(chat_id, role, content)

    return jsonify({"chat_id": chat_id, "message_id": message_id}), 201