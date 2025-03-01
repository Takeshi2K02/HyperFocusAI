from flask import Flask
from app.routes.tasks import task_bp
from app.routes.chatbot import chatbot_bp  # ✅ Import chatbot blueprint
from app.db import mongo_service  # ✅ MongoDB connection

app = Flask(__name__)

# ✅ Register Blueprints
app.register_blueprint(task_bp, url_prefix="/tasks")
app.register_blueprint(chatbot_bp, url_prefix="/chat")  # ✅ Chatbot routes

@app.route("/")
def home():
    return "MongoDB Connected Successfully!"

if __name__ == "__main__":
    app.run(debug=True)