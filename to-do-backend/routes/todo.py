from flask import Blueprint, request, jsonify
from db.data_access import DataAccess
from services.todo_service import get_todo, update_todo, add_todo, get_all_todos

todo_bp = Blueprint('todo', __name__, url_prefix='/todo')

# GET /todo
@todo_bp.route('', methods=['GET'])
def get_todos_route():
    try:
        todos = get_all_todos()
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    return todos

@todo_bp.route('', methods=['POST'])
def add_todo_route():
    data = request.get_json() or {}
    try:
        result = add_todo(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    return result

@todo_bp.route('/<int:todo_id>', methods=['GET'])
def get_todo_route(todo_id):
    try:
        todo = get_todo(todo_id)
        if not todo:
            return jsonify({'error': 'Todo not found'}), 404
        return jsonify(todo), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@todo_bp.route('/<int:todo_id>', methods=['PATCH'])
def update_todo_route(todo_id):
    try:
        data = request.get_json() or {}
        data['id'] = todo_id  # Ensure the ID from the URL is used
        updated_todo = update_todo(data)
        if not updated_todo:
            return jsonify({'error': 'Todo not found'}), 404
        return jsonify(updated_todo), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

