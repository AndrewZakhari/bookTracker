from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from config import Config
from models import db
from routes import init_routes

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
Migrate(app, db)
Bcrypt(app)
JWTManager(app)

init_routes(app)

if __name__ == '__main__':
    app.run(debug=True)