import os
import sys
import pytest
from unittest.mock import patch
from app import create_app

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Make app a proper pytest fixture
@pytest.fixture
def app():
    return create_app()

@pytest.fixture
def client(app):
    return app.test_client()


def test_get_todos_success(app):
    with patch("routes.todo.get_all_todos") as mock_get_all:
        mock_get_all.return_value = [{"id": 1, "description": "task", "completed": False}]

        client = app.test_client()
        resp = client.get('/todo')

        # GET should return 200 on success
        assert resp.status_code == 200
        assert resp.get_json() == [{"id": 1, "description": "task", "completed": False}]


def test_get_todos_service_exception_returns_400(app):
    with patch("routes.todo.get_all_todos") as mock_get_all:
        mock_get_all.side_effect = Exception("DB failure")

        client = app.test_client()
        resp = client.get('/todo')

        assert resp.status_code == 400
        assert resp.get_json() == {"error": "DB failure"}


def test_add_todo_success(app):
    with patch("routes.todo.add_todo") as mock_add:
        mock_add.return_value = ({"id": 5, "description": "New item", "completed": True}, 201)

        client = app.test_client()
        resp = client.post('/todo', json={"description": "New item", "completed": True})

        assert resp.status_code == 201
        assert resp.get_json() == {"id": 5, "description": "New item", "completed": True}


def test_add_todo_service_exception_returns_400(app):
    with patch("routes.todo.add_todo") as mock_add:
        mock_add.side_effect = Exception("DB error")

        client = app.test_client()
        resp = client.post('/todo', json={"description": "Will fail"})

        assert resp.status_code == 400
        assert resp.get_json() == {"error": "DB error"}


def test_get_todo_empty_dict_returns_404(client):
    with patch('routes.todo.get_todo', return_value={}):
        resp = client.get('/todo/1')
        assert resp.status_code == 404
        assert resp.get_json() == {'error': 'Todo not found'}

def test_get_todo_non_int_path_returns_404(client):
    resp = client.get('/todo/abc')
    assert resp.status_code == 404

def test_update_id_override_calls_service_with_url_id(client):
    with patch('routes.todo.update_todo') as mock_update:
        mock_update.return_value = {'id': 1, 'title': 'Ignored'}
        resp = client.patch('/todo/1', json={'id': 999, 'title': 'Ignored'})
        assert resp.status_code == 200
        assert resp.get_json() == {'id': 1, 'title': 'Ignored'}
        mock_update.assert_called_once()
        called_arg = mock_update.call_args[0][0]
        assert called_arg['id'] == 1
        assert called_arg.get('title') == 'Ignored'

def test_update_no_json_uses_url_id(client):
    # Route likely treats missing body as empty dict -> success
    with patch('routes.todo.update_todo') as mock_update:
        mock_update.return_value = {'id': 2}
        resp = client.patch('/todo/2')  # no json body
        assert resp.status_code == 400

def test_update_non_int_path_returns_404(client):
    resp = client.patch('/todo/xyz', json={'title': 'Nope'})
    assert resp.status_code == 404