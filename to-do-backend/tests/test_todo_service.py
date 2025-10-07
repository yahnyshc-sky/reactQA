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
        assert data == {"id": 123, "description": "New item", "completed": True}

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