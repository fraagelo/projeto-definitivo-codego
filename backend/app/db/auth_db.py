from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator

from app.core.config import settings


engine_auth = create_engine(
    settings.auth_db_url,
    pool_pre_ping=True,
)

SessionLocalAuth = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine_auth,
)


def get_auth_db() -> Generator[Session, None, None]:
    db = SessionLocalAuth()
    try:
        yield db
    finally:
        db.close()
