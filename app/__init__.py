from flask import Flask

def create_app():
    app = Flask(__name__)
    app.secret_key = "mi_clave_secreta"

    from .routes import main
    app.register_blueprint(main)

    return app
