from flask import Blueprint, request, jsonify
from app.services.chat_service import (
    get_or_create_chat,
    delete_chat,
    store_message,
    get_chat_messages
)

chat_bp = Blueprint("chat", __name__, url_prefix="/chat")

# ✅ Handle new chat (Returns empty response, no creation yet)
@chat_bp.route("/", methods=["GET"])
def new_chat():
    return jsonify({"message": "New chat session started"}), 200

# ✅ Store message & create chat only when user sends first message
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
    
    # ✅ Store message
    message_id = store_message(chat_id, role, content)
    
    return jsonify({"chat_id": chat_id, "message_id": message_id}), 201

# ✅ Retrieve messages from a chat by chat_id
@chat_bp.route("/<chat_id>", methods=["GET"])
def fetch_chat_messages(chat_id):
    messages = get_chat_messages(chat_id)
    return jsonify({"chat_id": chat_id, "messages": messages}), 200