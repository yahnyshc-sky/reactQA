import pymysql

from db.data_access import DataAccess
from flask import jsonify

def update_todo(data):
    # 'id' is required; other fields are optional
    if 'id' not in data:
        raise ValueError("Missing required field: 'id'")

    todo_id = data['id']
    set_clauses = []
    params = []

    if 'description' in data:
        set_clauses.append("description = %s")
        params.append(data['description'])
    if 'completed' in data:
        set_clauses.append("completed = %s")
        params.append(data['completed'])

    if not set_clauses:
        raise ValueError("No updatable fields provided")

    params.append(todo_id)
    update_query = f"UPDATE todo SET {', '.join(set_clauses)} WHERE id = %s"

    dao = DataAccess()
    dao.execute(update_query, params)

    return get_todo(todo_id)


def get_todo(todo_id):
    dao = DataAccess()
    try:
        result = dao.query("SELECT id, description, created_at, completed FROM todo WHERE id = %s", (todo_id,))
    except pymysql.MySQLError as e:
        raise RuntimeError(f'Database query error: {e}')

    if not result:
        return None

    # todo = result[0]
    # Convert to a dictionary for easier consumption
    return result[0]

def add_todo(data):
    description = data.get('description')
    completed = data.get('completed', False)

    if not description:
        return jsonify({'error': 'Description is required'}), 400

    try:
        dao = DataAccess()
        lastrowid = dao.execute("INSERT INTO todo (description, completed) VALUES (%s, %s);",(description, completed))
        todo = get_todo(lastrowid)
        return jsonify({'description': description, 'completed': completed, "created_at": todo["created_at"]}), 201
    except Exception as e:
        raise e

def get_all_todos():
    try:
        dao = DataAccess()
        todos = dao.query("SELECT id, description, created_at, completed FROM todo ORDER BY created_at ASC;")
        return todos
    except Exception as e:
        raise e