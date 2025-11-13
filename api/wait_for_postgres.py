
import os
import time
import psycopg2
from psycopg2 import OperationalError

def wait_for_db():
    """
    Waits for the PostgreSQL database to be available.
    """
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        raise ValueError("DATABASE_URL environment variable not set")

    retries = 30
    while retries > 0:
        try:
            psycopg2.connect(db_url)
            print("Database is connected.", flush=True)
            return
        except OperationalError as e:
            print(f"Database not ready yet, waiting... ({e})", flush=True)
            retries -= 1
            time.sleep(1)
    
    raise Exception("Database did not become available in time.")

if __name__ == "__main__":
    wait_for_db()
