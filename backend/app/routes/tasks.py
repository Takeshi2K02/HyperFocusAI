from flask import Blueprint, request, jsonify
from app.services.task_service import add_task_to_db, get_all_tasks, get_task_by_id, update_task, delete_task

task_bp = Blueprint("tasks", __name__)  # ✅ Define Blueprint

@task_bp.route("", methods=["POST"])  # ✅ No leading "/tasks"
def create_task():
    data = request.json
    task_id = add_task_to_db(data)
    return jsonify({"message": "Task created", "task_id": task_id}), 201

@task_bp.route("", methods=["GET"])
def get_tasks():
    tasks = get_all_tasks()
    return jsonify(tasks), 200

@task_bp.route("/<task_id>", methods=["GET"])
def get_task(task_id):
    task = get_task_by_id(task_id)
    if task:
        return jsonify(task), 200
    return jsonify({"message": "Task not found"}), 404

@task_bp.route("/<task_id>", methods=["PUT"])
def update_task_route(task_id):
    data = request.json
    if update_task(task_id, data):
        return jsonify({"message": "Task updated"}), 200
    return jsonify({"message": "Task not found"}), 404

@task_bp.route("/<task_id>", methods=["DELETE"])
def delete_task_route(task_id):
    if delete_task(task_id):
        return jsonify({"message": "Task deleted"}), 200
    return jsonify({"message": "Task not found"}), 404