DEBUG = True

SECRET_KEY = 'v-0wa-43amc=-29-30mdci230j'

# host.docker.internal for docker
SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://admin:12345@localhost:3306/mydb'

SQLALCHEMY_TRACK_MODIFICATIONS = False

CORS_HEADERS = 'Content-Type'

UPLOAD_FOLDER = 'news_parsing/frontend/public/uploads'

PARSING_IS_RUNNING = False
PARSING_TIME = 1
PARSING_REGION = 'africa'
