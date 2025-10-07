from flask import Flask
from routes.todo import todo_bp

def create_app():
    app = Flask(__name__)

    # Register blueprints
    app.register_blueprint(todo_bp)

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)