from flask import Blueprint, request, jsonify
from db.data_access import DataAccess
from services.todo_service import get_todo, update_todo, add_todo, get_all_todos

todo_bp = Blueprint('todo', __name__, url_prefix='/todo')

# GET /todo
@todo_bp.route('', methods=['GET'])
def get_todos():
    try:
        todos = get_all_todos()
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    return jsonify({ "todos": todos }), 201

@todo_bp.route('', methods=['POST'])
def add_todo():
    data = request.get_json() or {}
    try:
        result = add_todo(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    return jsonify({ "todo": result }), 201

@todo_bp.route('/<:todo_id>', methods=['GET'])
def get_todo_route(todo_id):
    todo = None
    try:
        todo = get_todo(todo_id)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    return jsonify({ "todo": todo }), 201

@todo_bp.route('/<:todo_id>', methods=['PATCH'])
def update_todo_route(todo_id):
    data = request.json or {}

    updated_todo = None
    try:
        updated_todo = update_todo(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    return jsonify({ "todo": updated_todo }), 201

