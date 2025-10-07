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
        set_clauses.append("description = ?")
        params.append(data['description'])
    if 'completed' in data:
        set_clauses.append("completed = ?")
        params.append(data['completed'])

    if not set_clauses:
        raise ValueError("No updatable fields provided")

    params.append(todo_id)
    update_query = f"UPDATE todo SET {', '.join(set_clauses)} WHERE id = ?"

    dao = DataAccess()
    dao.execute(update_query, params)

    return get_todo(todo_id)


def get_todo(todo_id):
    dao = DataAccess()
    query = """
        SELECT id, description, created_at, completed
        FROM todo
        WHERE id = ?
    """
    result = dao.query(query, [todo_id])

    if not result:
        return None

    todo = result[0]
    # Convert to a dictionary for easier consumption
    return {
        "id": todo[0],
        "description": todo[1],
        "created_at": todo[2],
        "completed": bool(todo[3])
    }

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