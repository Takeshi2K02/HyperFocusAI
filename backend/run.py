from app.main import app
from app.db import mongo_service

db = mongo_service.get_db()
print(db.list_collection_names())

if __name__ == "__main__":
    app.run(debug=True)