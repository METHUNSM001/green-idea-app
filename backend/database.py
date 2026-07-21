"""Database access for the Green Idea backend.

Talks directly to the project's Supabase Postgres database over a pooled
connection (psycopg2). Replaces the old per-request mysql.connector calls:
connections are reused instead of opened fresh on every request, and the
context-managed cursor below guarantees commit/rollback + cleanup even
when a route raises, which the old try/except/close-by-hand pattern did
not.
"""
from contextlib import contextmanager

import psycopg2
import psycopg2.extras
import psycopg2.pool

import config

_pool = psycopg2.pool.ThreadedConnectionPool(
    minconn=1,
    maxconn=config.DB_POOL_MAX,
    dsn=config.DATABASE_URL,
)


@contextmanager
def get_db_cursor(commit=False):
    """Yield a dict-style cursor for one unit of work.

    Usage:
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM workers")
            rows = cursor.fetchall()

        with get_db_cursor(commit=True) as cursor:
            cursor.execute("INSERT INTO workers (...) VALUES (...)", params)

    The connection always goes back to the pool, and is rolled back
    automatically if the block raises, so a failed request can never
    leak a connection or leave a half-written transaction behind.
    """
    connection = _pool.getconn()
    try:
        cursor = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        try:
            yield cursor
            if commit:
                connection.commit()
        except Exception:
            connection.rollback()
            raise
        finally:
            cursor.close()
    finally:
        _pool.putconn(connection)
