from flask import Blueprint, request, jsonify
from app.services.nlu_service import extract_task_from_text
from app.services.task_service import add_task_to_db

chatbot_bp = Blueprint("chatbot", __name__)

# ✅ Store pending task confirmations
pending_tasks = {}

def is_casual_mention(user_message):
    """Detect if a message is a casual mention instead of a direct command."""
    casual_phrases = ["i need to", "i have to", "i'm planning to", "i should", "i must", "i will"]
    
    # ✅ FIX: Correct the loop by using "phrase" inside the `any()` function
    return any(phrase in user_message.lower() for phrase in casual_phrases)


@chatbot_bp.route("", methods=["POST"])  # ✅ Route already prefixed with "/chat"
def chat():
    user_message = request.json.get("message")

    # ✅ Step 1: Handle Confirmations (User says "Yes" or "No")
    if user_message.lower() in ["yes", "confirm", "add it"]:
        if "pending_task" in pending_tasks:
            task_data = pending_tasks.pop("pending_task")  # Retrieve stored task

            print("🔍 Retrieved Task for Confirmation:", task_data)  # ✅ Debugging log

            # ✅ Ensure we still have task data before saving
            if not task_data or "title" not in task_data:
                return jsonify({"message": "Error: Task details lost before saving."}), 500

            # ✅ Remove unnecessary fields
            task_data.pop("task_detected", None)
            task_data.pop("confirmation_needed", None)

            # ✅ Convert field names to match the `Task` model
            mapped_task_data = {
                "title": task_data.get("title", "Untitled Task"),  # ✅ Fix: Use "title", not "task_title"
                "description": "",  # Default empty description
                "status": "pending",  # Default status
                "priority": task_data.get("priority", "medium"),  # Default to "medium"
                "due_date": task_data.get("due_date", None)  # Keep as is
            }

            print("✅ Final Task Before Saving:", mapped_task_data)  # ✅ Debugging log

            task_id = add_task_to_db(mapped_task_data)  # ✅ Add to database
            return jsonify({"message": f"Task '{mapped_task_data['title']}' added!", "task_id": task_id}), 201
        else:
            return jsonify({"message": "No pending task to confirm."}), 400

    elif user_message.lower() in ["no", "cancel", "ignore"]:
        pending_tasks.pop("pending_task", None)  # Remove stored task
        return jsonify({"message": "Task addition canceled."}), 200

    # ✅ Step 2: Process User Input with Gemini
    task_data = extract_task_from_text(user_message)

    if task_data.get("task_detected", False):
        # ✅ Remove unnecessary fields
        task_data.pop("task_detected", None)

        # ✅ Convert field names to match the `Task` model
        mapped_task_data = {
            "title": task_data.get("task_title", "Untitled Task"),  # ✅ Ensure correct field mapping
            "description": "",
            "status": "pending",
            "priority": task_data.get("priority", "medium"),
            "due_date": task_data.get("due_date", None)
        }

        # ✅ Step 3: Enforce Confirmation for Casual Mentions
        if is_casual_mention(user_message):
            print("🔍 Detected casual mention → Storing in pending_tasks.")
            pending_tasks["pending_task"] = mapped_task_data  # Store for later confirmation
            print("✅ Stored Task in pending_tasks:", pending_tasks["pending_task"])  # ✅ Debugging log
            return jsonify({
                "message": f"Should I add '{mapped_task_data['title']}' as a task?",
                "task_data": mapped_task_data
            })

        # ✅ Step 4: If "confirmation_needed" is False → Direct command, add task immediately
        if not task_data.get("confirmation_needed", True):
            task_id = add_task_to_db(mapped_task_data)
            return jsonify({"message": f"Task '{mapped_task_data['title']}' added instantly!", "task_id": task_id}), 201

    # ✅ Step 5: No task detected → General Assistant Response
    return jsonify({"message": "I'm here to assist you!"})