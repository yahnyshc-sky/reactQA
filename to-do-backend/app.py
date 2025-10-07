from flask import Flask
from routes.todo import todo_bp
from flask_cors import CORS

def create_app():
    app = Flask(__name__)

    # Register blueprints
    app.register_blueprint(todo_bp)

    CORS(app)

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)