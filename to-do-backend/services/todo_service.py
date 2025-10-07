from db.data_access import DataAccess
from flask import jsonify

def update_todo(data):
    id = data['id']
    description = data['description']
    completed = data['completed']

def get_todo(todo_id):
    return None

def add_todo(data):
    description = data.get('description')
    completed = data.get('completed', False)

    if not description:
        return jsonify({'error': 'Description is required'}), 400

    try:
        dao = DataAccess()
        dao.execute("INSERT INTO todo (description, completed) VALUES (%s, %s);",(description, completed))
        return jsonify({'id': dao.lastrowid, 'description': description, 'completed': completed}), 201
    except Exception as e:
        raise e 

def get_all_todos():
    try:
        dao = DataAccess()
        todos = dao.query("SELECT id, description, created_at, completed FROM todo ORDER BY created_at DESC;")
        return todos
    except Exception as e:
        raise e