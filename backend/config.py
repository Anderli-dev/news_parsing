DEBUG = True

SECRET_KEY = 'v-0wa-43amc=-29-30mdci230j'

# host.docker.internal for docker or localhost
SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://admin:12345@db:3306/mydb'

SQLALCHEMY_TRACK_MODIFICATIONS = False

CORS_HEADERS = 'Content-Type'

# remove "news_parsing/" when using docker
UPLOAD_FOLDER = 'frontend/public/uploads'

PARSING_IS_RUNNING = False
PARSING_TIME = 1
PARSING_REGION = 'africa'
