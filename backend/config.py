DEBUG = True

SECRET_KEY = 'v-0wa-43amc=-29-30mdci230j'

SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://admin:12345@localhost/mydb'

SQLALCHEMY_TRACK_MODIFICATIONS = False

CORS_HEADERS = 'Content-Type'

UPLOAD_FOLDER = 'news_parsing/frontend/public/uploads'

CELERY_BROKER_URL = 'redis://localhost:6379/0'
