from flask import Flask
from app.routes.tasks import task_bp
from app.db import mongo_service  # ✅ Import the direct MongoDB service

app = Flask(__name__)

# ✅ Register Blueprints
app.register_blueprint(task_bp, url_prefix="/tasks")

@app.route("/")
def home():
    return "MongoDB Connected Successfully!"

if __name__ == "__main__":
    app.run(debug=True)
