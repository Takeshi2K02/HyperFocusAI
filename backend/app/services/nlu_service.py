import google.generativeai as genai
import json
import re
from app.config import Config

# ✅ Configure Gemini API
genai.configure(api_key=Config.GEMINI_API_KEY)

# ✅ Use the correct model for free-tier users
model = genai.GenerativeModel("gemini-1.5-flash")  # or "gemini-1.5-pro"

def extract_task_from_text(user_message):
    """Send user message to Gemini API and extract potential tasks."""
    
    prompt = f"""
    Extract task-related information from the following user message:
    Message: "{user_message}"

    If the message contains a task, return a JSON object with:
    {{
        "task_detected": true,
        "task_title": "...",
        "due_date": "...",
        "priority": "...",
        "confirmation_needed": true/false
    }}

    If no task is found, return: {{"task_detected": false}}.
    Only return JSON. Do not include explanations or extra text.
    """

    try:
        response = model.generate_content(prompt)  # ✅ Use correct function
        response_text = response.text.strip()  # ✅ Ensure clean output
        print("🔍 Raw Gemini Response:", response_text)  # ✅ Debugging line

        # ✅ Step 1: Remove Markdown-style code blocks
        cleaned_response = re.sub(r"```json|```", "", response_text).strip()

        # ✅ Step 2: Extract only JSON using regex
        match = re.search(r"\{.*\}", cleaned_response, re.DOTALL)
        if match:
            cleaned_response = match.group(0)  # Extract JSON part only
        else:
            print("❌ No valid JSON found in response.")
            return {"task_detected": False}

        # ✅ Step 3: Parse JSON safely
        task_data = json.loads(cleaned_response)

        return task_data  # ✅ Successfully return structured data

    except (json.JSONDecodeError, AttributeError) as e:
        print(f"❌ Error parsing Gemini response: {e}")
        return {"task_detected": False}  # ✅ Fail gracefully