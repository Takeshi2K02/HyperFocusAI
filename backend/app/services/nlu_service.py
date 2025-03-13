import google.generativeai as genai
import requests
import json
import re
from app.config import Config

# ✅ Configure Gemini API
genai.configure(api_key=Config.GEMINI_API_KEY)

# ✅ Use the correct model
model = genai.GenerativeModel("gemini-1.5-flash")

def generate_chat_title(user_message):
    """Generate a short, meaningful chat title from the first user message using Gemini API."""
    
    prompt_text = f"""
    Generate a short and meaningful chat title (max 6 words) based on the following message:
    "{user_message}"
    
    ONLY return the title without any explanations or extra text.
    """

    try:
        response = model.generate_content(prompt_text)
        chat_title = response.text.strip()

        print("📝 AI-Generated Chat Title:", chat_title)

        # ✅ Ensure the title is concise
        return chat_title if len(chat_title.split()) <= 6 else "Untitled Chat"

    except Exception as e:
        print(f"❌ Error generating chat title: {e}")
        return "Untitled Chat"  # ✅ Prevents failures


def extract_task_from_text(user_message):
    """Send user message to Gemini API and extract potential tasks."""
    
    prompt = f"""
    Analyze the following user message:
    Message: "{user_message}"

    Determine if the message is truly a task or just general conversation.
    
    If it is a task, return a JSON object with:
    {{
        "task_detected": true,
        "task_title": "...",
        "due_date": "...",
        "priority": "...",
        "confirmation_needed": true/false
    }}

    If it is NOT a task (e.g., a joke request, question, or greeting), return:
    {{
        "task_detected": false,
        "reason": "Message is a general chat request."
    }}
    
    Only return JSON. Do not include explanations or extra text.
    """

    try:
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        print("🔍 Raw Task Response:", response_text)

        # ✅ Remove Markdown-style code blocks
        cleaned_response = re.sub(r"```json|```", "", response_text).strip()

        # ✅ Extract JSON part only
        match = re.search(r"\{.*\}", cleaned_response, re.DOTALL)
        if match:
            cleaned_response = match.group(0)
        else:
            print("❌ No valid JSON found in response.")
            return {"task_detected": False}

        task_data = json.loads(cleaned_response)
        return task_data  

    except (json.JSONDecodeError, AttributeError) as e:
        print(f"❌ Error parsing Gemini response: {e}")
        return {"task_detected": False}

def generate_chat_response(user_message):
    """Send a general chat message to Gemini API for an intelligent response."""
    
    prompt = f"""
    You are a helpful AI assistant. Respond to the following message in a friendly and natural way:
    "{user_message}"
    
    Keep your response concise and helpful.
    """

    try:
        response = model.generate_content(prompt)
        chat_response = response.text.strip()
        print("💬 Chatbot Response:", chat_response)
        return chat_response

    except Exception as e:
        print(f"❌ Error generating chat response: {e}")
        return "I'm here to assist you!"
