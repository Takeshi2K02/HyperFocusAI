from flask import Blueprint, request, jsonify
from app.services.nlu_service import extract_task_from_text, generate_chat_response
from app.services.task_service import add_task_to_db, get_all_tasks

chatbot_bp = Blueprint("chatbot", __name__)

# ✅ Store pending task confirmations
pending_tasks = {}

def is_casual_mention(user_message):
    """Detect if a message is a casual mention instead of a direct command."""
    casual_phrases = ["i need to", "i have to", "i'm planning to", "i should", "i must", "i will"]
    
    # ✅ Fix: Ensure `phrase` is properly referenced inside `any()`
    return any(phrase in user_message.lower() for phrase in casual_phrases)


def is_task_retrieval_request(user_message):
    """Detect if the user is asking for their task list."""
    retrieval_phrases = ["show me my tasks", "what are my tasks", "list my tasks", "my pending tasks"]
    
    # ✅ Fix: Use `phrase` correctly inside `any()`
    return any(phrase in user_message.lower() for phrase in retrieval_phrases)


@chatbot_bp.route("", methods=["POST"])
def chat():
    user_message = request.json.get("message")

    # ✅ Step 1: Handle Confirmations (User says "Yes" or "No")
    if user_message.lower() in ["yes", "confirm", "add it"]:
        if "pending_task" in pending_tasks:
            task_data = pending_tasks.pop("pending_task")

            print("🔍 Retrieved Task for Confirmation:", task_data)

            if not task_data.get("title"):
                return jsonify({"message": "Error: Task details lost before saving."}), 500

            task_data.pop("task_detected", None)
            task_data.pop("confirmation_needed", None)

            task_id = add_task_to_db(task_data)
            return jsonify({"message": f"Task '{task_data['title']}' added!", "task_id": task_id}), 201
        else:
            return jsonify({"message": "No pending task to confirm."}), 400

    elif user_message.lower() in ["no", "cancel", "ignore"]:
        pending_tasks.pop("pending_task", None)
        return jsonify({"message": "Task addition canceled."}), 200

    # ✅ Step 2: Handle Task Retrieval Requests
    if is_task_retrieval_request(user_message):
        tasks = get_all_tasks()
        if not tasks:
            return jsonify({"message": "You have no tasks."})
        
        task_list = "\n".join([f"- {task['title']} (Status: {task['status']})" for task in tasks])
        return jsonify({"message": f"Here are your tasks:\n{task_list}"})

    # ✅ Step 3: Process User Input with Gemini for Task Detection
    task_data = extract_task_from_text(user_message)

    if task_data.get("task_detected", False):
        task_data.pop("task_detected", None)

        mapped_task_data = {
            "title": task_data.get("task_title", "Untitled Task"),
            "description": "",
            "status": "pending",
            "priority": task_data.get("priority", "medium"),
            "due_date": task_data.get("due_date", None)
        }

        if is_casual_mention(user_message):
            print("🔍 Detected casual mention → Forcing confirmation.")
            pending_tasks["pending_task"] = mapped_task_data
            print("✅ Stored Task in pending_tasks:", pending_tasks["pending_task"])
            return jsonify({
                "message": f"Should I add '{mapped_task_data['title']}' as a task?",
                "task_data": mapped_task_data
            })

        if not task_data.get("confirmation_needed", True):
            task_id = add_task_to_db(mapped_task_data)
            return jsonify({"message": f"Task '{mapped_task_data['title']}' added instantly!", "task_id": task_id}), 201

    # ✅ Step 4: If No Task, Generate General Chat Response
    chat_response = generate_chat_response(user_message)
    return jsonify({"message": chat_response})
