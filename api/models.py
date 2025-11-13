from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    google_books_id = db.Column(db.String(120), unique=True, nullable=False)
    title = db.Column(db.String(120), nullable=False)
    author = db.Column(db.String(120))
    published_date = db.Column(db.String(20))
    thumbnail_url = db.Column(db.String(255))

class UserBook(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='to-read')  # to-read, reading, read
    progress = db.Column(db.Integer, default=0) # e.g., page number or percentage

    user = db.relationship('User', backref=db.backref('user_books', lazy=True))
    book = db.relationship('Book', backref=db.backref('user_books', lazy=True))
