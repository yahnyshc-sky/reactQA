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

@todo_bp.route('/<int:todo_id>', methods=['GET'])
def get_todo_route(todo_id):
    try:
        todo = get_todo(todo_id)
        if not todo:
            return jsonify({'error': 'Todo not found'}), 404
        return jsonify({"todo": todo}), 200
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
        return jsonify({"todo": updated_todo}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

