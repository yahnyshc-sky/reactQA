import os
import sys
from unittest.mock import Mock, patch
import pytest
from flask import Flask
from services.todo_service import update_todo, get_todo, add_todo, get_all_todos

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

@pytest.fixture
def flask_app():
    app = Flask(__name__)
    return app

def test_add_todo_success(flask_app):
    with patch("services.todo_service.DataAccess") as MockDA:
        dao = Mock()
        dao.execute.return_value = None
        dao.lastrowid = 123
        MockDA.return_value = dao

        with flask_app.app_context():
            response, status = add_todo({"description": "New item", "completed": True})

        assert status == 201
        data = response.get_json()
        assert data == {"description": "New item", "completed": True}

        exec_args, _ = dao.execute.call_args
        assert "INSERT INTO todo" in exec_args[0]

        assert exec_args[1] == ("New item", True)


def test_add_todo_missing_description_returns_400(flask_app):
    with flask_app.app_context():
        response, status = add_todo({})
    assert status == 400
    assert response.get_json() == {"error": "Description is required"}


def test_add_todo_propagates_exception(flask_app):
    with patch("services.todo_service.DataAccess") as MockDA:
        dao = Mock()
        dao.execute.side_effect = Exception("DB failure")
        MockDA.return_value = dao

        with flask_app.app_context():
            with pytest.raises(Exception, match="DB failure"):
                add_todo({"description": "Will fail", "completed": False})


def test_get_all_todos_success():
    with patch("services.todo_service.DataAccess") as MockDA:
        dao = Mock()
        todos = [
            (1, "a", "2025-01-01 00:00:00", 0),
            (2, "b", "2025-01-02 00:00:00", 1),
        ]
        dao.query.return_value = todos
        MockDA.return_value = dao

        res = get_all_todos()
        assert res == todos
        dao.query.assert_called_once()
        q_args, _ = dao.query.call_args
        assert "ORDER BY created_at DESC" in q_args[0]

def test_get_todo_success(flask_app):
    with patch("services.todo_service.DataAccess") as MockDA:
        dao = Mock()
        # Simulate one matching row: (id, description, created_at, completed_int)
        dao.query.return_value = [{"id": 42, "description": "Single item", "created_at": "2025-01-10 12:00:00", "completed": True}]
        MockDA.return_value = dao

        with flask_app.app_context():
            todo = get_todo(42)

        assert todo["id"] == 42
        assert todo["description"] == "Single item"
        assert todo["completed"] == True


def test_get_todo_not_found(flask_app):
    with patch("services.todo_service.DataAccess") as MockDA:
        dao = Mock()
        dao.query.return_value = []
        MockDA.return_value = dao

        with flask_app.app_context():
            todo = get_todo(999)

        assert todo == None


def test_update_todo_success(flask_app):
    with patch("services.todo_service.DataAccess") as MockDA:
        dao = Mock()
        # First the service will likely run an UPDATE (execute), then a SELECT (query) to return updated row
        dao.execute.return_value = None
        dao.query.return_value = [{"id": 7, "description": "Updated desc", "completed": False}]
        MockDA.return_value = dao

        with flask_app.app_context():
            updated_todo = update_todo({"id": 7, "description": "Updated desc", "completed": False})

        assert updated_todo["id"] == 7
        assert updated_todo["description"] == "Updated desc"
        assert updated_todo["completed"] == False

        # Ensure UPDATE was issued
        exec_args, _ = dao.execute.call_args
        assert "UPDATE todo" in exec_args[0]
        # Ensure SELECT afterwards
        dao.query.assert_called()
        # (Optional) verify id parameter in either execute or query
        assert 7 in exec_args[1]


def test_update_todo_not_found(flask_app):
    with patch("services.todo_service.DataAccess") as MockDA:
        dao = Mock()
        dao.execute.return_value = None
        # Simulate no row returned after update attempt
        dao.query.return_value = []
        MockDA.return_value = dao

        with flask_app.app_context():
            updated_todo = update_todo({"id": 321, "description": "Won't exist", "completed": True})

        assert updated_todo == None


def test_update_todo_missing_description_keeps_existing_when_not_provided(flask_app):
    # This assumes your service allows partial update (omit description). If not, adjust or remove.
    with patch("services.todo_service.DataAccess") as MockDA:
        dao = Mock()
        # After update, service fetches current row
        dao.execute.return_value = None
        dao.query.return_value = [{"id": 11, "description": "Existing desc", "created_at": "2025-03-01 10:00:00", "completed": True}]
        MockDA.return_value = dao

        with flask_app.app_context():
            updated_todo = update_todo({"id": 11, "completed": True})

        assert updated_todo["id"] == 11
        assert updated_todo["description"] == "Existing desc"  # unchanged
        assert updated_todo["completed"] == True