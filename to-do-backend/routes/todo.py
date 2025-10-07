from flask import Blueprint, request, jsonify
from services.todo_service import get_todo, update_todo

bp = Blueprint('todos', __name__, url_prefix='/todos')

@bp.route('/<:todo_id>', methods=['GET'])
def get_todo_route(todo_id):
    todo = None
    try:
        todo = get_todo(todo_id)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    return jsonify({ "todo": todo }), 201

@bp.route('/<:todo_id>', methods=['PATCH'])
def update_todo_route(todo_id):
    data = request.json or {}

    updated_todo = None
    try:
        updated_todo = update_todo(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    return jsonify({ "todo": updated_todo }), 201

