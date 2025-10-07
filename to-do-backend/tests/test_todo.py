import os
import sys
from unittest.mock import patch
import pytest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import create_app


@pytest.fixture
def app():
    return create_app()


def test_get_todos_success(app):
    with patch("routes.todo.get_all_todos") as mock_get_all:
        mock_get_all.return_value = [{"id": 1, "description": "task", "completed": False}]

        client = app.test_client()
        resp = client.get('/todo')

        assert resp.status_code == 201
        assert resp.get_json() == {"todos": [{"id": 1, "description": "task", "completed": False}]}


def test_get_todos_service_exception_returns_400(app):
    with patch("routes.todo.get_all_todos") as mock_get_all:
        mock_get_all.side_effect = Exception("DB failure")

        client = app.test_client()
        resp = client.get('/todo')

        assert resp.status_code == 400
        assert resp.get_json() == {"error": "DB failure"}


def test_add_todo_success(app):
    with patch("routes.todo.add_todo") as mock_add:
        mock_add.return_value = {"id": 5, "description": "New item", "completed": True}

        client = app.test_client()
        resp = client.post('/todo', json={"description": "New item", "completed": True})

        assert resp.status_code == 201
        assert resp.get_json() == {"todo": {"id": 5, "description": "New item", "completed": True}}


def test_add_todo_service_exception_returns_400(app):
    with patch("routes.todo.add_todo") as mock_add:
        mock_add.side_effect = Exception("DB error")

        client = app.test_client()
        resp = client.post('/todo', json={"description": "Will fail"})

        assert resp.status_code == 400
        assert resp.get_json() == {"error": "DB error"}
