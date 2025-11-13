# Book Tracker API

This is a Flask-based API for the Book Tracker application.

## Setup

1.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

2.  **Set up environment variables:**
    Create a `.env` file in the project root directory and add the following variables:
    ```
    SECRET_KEY=my-super-secret-key
    JWT_SECRET_KEY=my-super-secret-jwt-key
    # Replace with your PostgreSQL connection string
    DATABASE_URL=postgresql://user:password@db:5432/booktracker
    # Get an API key from Google Cloud Console
    GOOGLE_BOOKS_API_KEY=
    ```

3.  **Database migrations:**
    ```bash
    flask db init  # Run this only once to initialize migrations
    flask db migrate -m "Initial migration."
    flask db upgrade
    ```

## Running the API

To run the API in development mode, use the following command:

```bash
flask run
```

The API will be available at `http://127.0.0.1:5000`.
