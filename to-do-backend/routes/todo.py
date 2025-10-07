from flask import Blueprint, request, jsonify
from db.data_access import DataAccess
from services.todo_service import get_todo, update_todo

todo_bp = Blueprint('todo', __name__, url_prefix='/todo')

# GET /todo
@todo_bp.route('', methods=['GET'])
def get_todos():
    dao = DataAccess()
    todos = dao.query("SELECT id, description, created_at, completed FROM todo ORDER BY created_at DESC;")
    return jsonify(todos), 200

@todo_bp.route('', methods=['POST'])
def add_todo():
    data = request.get_json()
    description = data.get('description')
    completed = data.get('completed', False)

    if not description:
        return jsonify({'error': 'Description is required'}), 400

    dao = DataAccess()
    dao.execute("INSERT INTO todo (description, completed) VALUES (%s, %s);",(description, completed))

    return jsonify({'id': dao.lastrowid, 'description': description, 'completed': completed}), 201

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

