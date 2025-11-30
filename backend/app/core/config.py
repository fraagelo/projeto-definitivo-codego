from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Auth Dashboard API"
    auth_db_url: str
    secret_key: str

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
