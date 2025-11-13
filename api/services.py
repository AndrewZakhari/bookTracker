import requests
from flask import current_app

def search_books_by_query(query):
    api_key = current_app.config['GOOGLE_BOOKS_API_KEY']
    if not api_key:
        return {'error': 'Google Books API key is not configured'}, 500

    url = f"https://www.googleapis.com/books/v1/volumes?q={query}&key={api_key}"
    
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad status codes
        data = response.json()
        
        books = []
        for item in data.get('items', []):
            volume_info = item.get('volumeInfo', {})
            books.append({
                'google_books_id': item.get('id'),
                'title': volume_info.get('title'),
                'authors': volume_info.get('authors', []),
                'published_date': volume_info.get('publishedDate'),
                'description': volume_info.get('description'),
                'thumbnail_url': volume_info.get('imageLinks', {}).get('thumbnail')
            })
        return books, 200
    except requests.exceptions.RequestException as e:
        return {'error': str(e)}, 500
