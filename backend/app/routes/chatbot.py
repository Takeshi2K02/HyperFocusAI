from flask import Blueprint, request, jsonify
from app.services.nlu_service import extract_task_from_text
from app.services.task_service import add_task_to_db

chatbot_bp = Blueprint("chatbot", __name__)

@chatbot_bp.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    task_data = extract_task_from_text(user_message)

    if task_data.get("task_detected", False):
        return jsonify({
            "message": f"Should I add '{task_data['task_title']}' as a task?",
            "task_data": task_data
        })
    
    return jsonify({"message": "I'm here to assist you!"})