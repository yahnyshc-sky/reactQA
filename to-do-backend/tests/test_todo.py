import pytest
from unittest.mock import patch
from flask import Flask
from routes.todo import todo_bp

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(todo_bp)
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_get_todo_empty_dict_returns_404(client):
    with patch('routes.todo.get_todo', return_value={}):
        resp = client.get('/todo/1')
        assert resp.status_code == 404
        assert resp.get_json() == {'error': 'Todo not found'}

def test_get_todo_non_int_path_returns_404(client):
    resp = client.get('/todo/abc')
    assert resp.status_code == 404

def test_update_id_override_calls_service_with_url_id(client):
    # service should receive id from URL, overriding any id in body
    with patch('routes.todo.update_todo') as mock_update:
        mock_update.return_value = {'id': 1, 'title': 'Ignored'}
        resp = client.patch('/todo/1', json={'id': 999, 'title': 'Ignored'})
        assert resp.status_code == 200
        assert resp.get_json() == {'todo': {'id': 1, 'title': 'Ignored'}}
        mock_update.assert_called_once()
        called_arg = mock_update.call_args[0][0]
        assert called_arg['id'] == 1
        assert called_arg.get('title') == 'Ignored'

def test_update_no_json_uses_url_id(client):
    with patch('routes.todo.update_todo') as mock_update:
        mock_update.return_value = {'id': 2}
        resp = client.patch('/todo/2')  # no json body
        assert resp.status_code == 400

def test_update_non_int_path_returns_404(client):
    resp = client.patch('/todo/xyz', json={'title': 'Nope'})
    assert resp.status_code == 404
