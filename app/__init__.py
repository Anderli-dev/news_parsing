from celery import Celery
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

app.config.from_object('config')

celery_app = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
celery_app.conf.timezone = 'UTC'
celery_app.conf.update(app.config)

from celery_app import tasks # noqa

db = SQLAlchemy(app)
migrate = Migrate(app, db)

from models import * # noqa

db.create_all()
db.session.commit()
