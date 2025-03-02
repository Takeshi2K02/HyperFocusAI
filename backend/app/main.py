from flask import Flask
from flask_cors import CORS  # Import CORS
from app.routes.tasks import task_bp
from app.routes.chatbot import chatbot_bp
from app.db import mongo_service

app = Flask(__name__)

# ✅ Enable CORS for all routes
CORS(app, resources={r"/*": {"origins": "*"}})  

# ✅ Register Blueprints
app.register_blueprint(task_bp, url_prefix="/tasks")
app.register_blueprint(chatbot_bp, url_prefix="/chat")

@app.route("/")
def home():
    return "MongoDB Connected Successfully!"

if __name__ == "__main__":
    app.run(debug=True)