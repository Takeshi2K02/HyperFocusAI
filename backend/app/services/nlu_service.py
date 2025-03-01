import google.generativeai as genai
from app.config import Config

# Configure Gemini API
genai.configure(api_key=Config.GEMINI_API_KEY)

def extract_task_from_text(user_message):
    """Send user message to Gemini API and extract potential tasks."""
    
    prompt = f"""
    Extract task-related information from the following user message:
    Message: "{user_message}"
    
    If the message contains a task, return a JSON object with:
    - "task_title": (short description)
    - "due_date": (if mentioned)
    - "priority": (if urgency is mentioned: low, medium, high)
    - "confirmation_needed": (true if the user didn't explicitly request task creation)
    
    If no task is found, return: {{"task_detected": false}}.
    """

    response = genai.generate_text(prompt)
    
    return response.text  # Will return structured JSON-like response