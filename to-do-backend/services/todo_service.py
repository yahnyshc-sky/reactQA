from db.data_access import DataAccess

def update_todo(data):
    # Validate required fields
    required_keys = ['id', 'description', 'completed']
    if not all(k in data for k in required_keys):
        raise ValueError(f"Missing one or more required fields: {required_keys}")

    todo_id = data['id']
    description = data['description']
    completed = data['completed']

    dao = DataAccess()

    # Update the todo record
    update_query = """
        UPDATE todo
        SET description = ?, completed = ?
        WHERE id = ?
    """
    dao.execute(update_query, [description, completed, todo_id])

    # Return the updated record
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