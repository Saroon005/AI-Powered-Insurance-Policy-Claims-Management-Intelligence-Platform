from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    # MySQL Configuration
    MYSQL_HOST: str
    MYSQL_PORT: int
    MYSQL_USER: str
    MYSQL_PASSWORD: str
    MYSQL_DB: str

    # App Configuration
    APP_NAME: str = "Insurance AI Service"
    APP_VERSION: str = "1.0.0"

    class Config:
        env_file = ".env"


settings = Settings()