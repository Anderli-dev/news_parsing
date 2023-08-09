from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

from celery_app.app import get_celery_app_instance

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

app.config.from_object('backend.config')

celery_app = get_celery_app_instance(app)

db = SQLAlchemy(app)
migrate = Migrate(app, db)

from backend.models import *  # noqa

with app.app_context():
    db.create_all()
    db.session.commit()

from celery_app import tasks  # noqa
from backend import routes  # noqa
