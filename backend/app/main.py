from flask import Flask
from flask_cors import CORS
from app.routes.tasks import task_bp
from app.routes.chat_routes import chat_bp  # ✅ Import new routes
from app.db import MongoService

app = Flask(__name__)

# ✅ Initialize MongoDB connection
mongo_service = MongoService()

# ✅ Enable CORS for all routes
CORS(app, resources={r"/*": {"origins": "*"}})

# ✅ Register Blueprints
app.register_blueprint(task_bp, url_prefix="/tasks")
app.register_blueprint(chat_bp, url_prefix="/chat")  # ✅ Ensure only one chat API

@app.route("/")
def home():
    return "MongoDB Connected Successfully!"

if __name__ == "__main__":
    app.run(debug=True)
