from flask import request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User, Book, UserBook
from services import search_books_by_query

def init_routes(app):
    @app.route('/api/users/register', methods=['POST'])
    def register_user():
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400

        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already exists'}), 400

        user = User(username=username)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        return jsonify({'message': 'User created successfully'}), 201

    @app.route('/api/login', methods=['POST'])
    def login():
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        user = User.query.filter_by(username=username).first()

        if user and user.check_password(password):
            access_token = create_access_token(identity=user.id)
            return jsonify(access_token=access_token)

        return jsonify({'error': 'Invalid credentials'}), 401

    @app.route('/api/books/search', methods=['GET'])
    @jwt_required()
    def search_books():
        query = request.args.get('q')
        if not query:
            return jsonify({'error': 'Search query is required'}), 400
        
        books, status_code = search_books_by_query(query)
        return jsonify(books), status_code

    @app.route('/api/library', methods=['POST'])
    @jwt_required()
    def add_book_to_library():
        data = request.get_json()
        google_books_id = data.get('google_books_id')
        user_id = get_jwt_identity()

        if not google_books_id:
            return jsonify({'error': 'google_books_id is required'}), 400

        book = Book.query.filter_by(google_books_id=google_books_id).first()
        if not book:
            # If book is not in our DB, add it
            book = Book(
                google_books_id=google_books_id,
                title=data.get('title'),
                author=", ".join(data.get('authors', [])),
                published_date=data.get('published_date'),
                thumbnail_url=data.get('thumbnail_url')
            )
            db.session.add(book)
            db.session.commit()

        if UserBook.query.filter_by(user_id=user_id, book_id=book.id).first():
            return jsonify({'error': 'Book already in library'}), 400

        user_book = UserBook(user_id=user_id, book_id=book.id)
        db.session.add(user_book)
        db.session.commit()

        return jsonify({'message': 'Book added to library'}), 201

    @app.route('/api/library', methods=['GET'])
    @jwt_required()
    def get_library():
        user_id = get_jwt_identity()
        user_books = UserBook.query.filter_by(user_id=user_id).all()
        
        library = []
        for ub in user_books:
            library.append({
                'user_book_id': ub.id,
                'status': ub.status,
                'progress': ub.progress,
                'book': {
                    'id': ub.book.id,
                    'google_books_id': ub.book.google_books_id,
                    'title': ub.book.title,
                    'author': ub.book.author,
                    'published_date': ub.book.published_date,
                    'thumbnail_url': ub.book.thumbnail_url
                }
            })
        return jsonify(library)

    @app.route('/api/library/<int:user_book_id>', methods=['PUT'])
    @jwt_required()
    def update_reading_progress(user_book_id):
        data = request.get_json()
        user_id = get_jwt_identity()

        user_book = UserBook.query.get(user_book_id)

        if not user_book or user_book.user_id != user_id:
            return jsonify({'error': 'User book not found'}), 404

        if 'status' in data:
            user_book.status = data['status']
        if 'progress' in data:
            user_book.progress = data['progress']
        
        db.session.commit()
        return jsonify({'message': 'Reading progress updated'})
