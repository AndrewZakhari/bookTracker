from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from config import Config
from models import db
from routes import init_routes
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
Migrate(app, db)
Bcrypt(app)
JWTManager(app)
CORS(app, 
     resources={r"/api/*": {"origins": "*"}},  # Start permissive for testing
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
init_routes(app)

if __name__ == '__main__':
    app.run(debug=True)