from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from apscheduler.schedulers.background import BackgroundScheduler

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

app.config.from_object('backend.config')

sched = BackgroundScheduler()

db = SQLAlchemy(app)

from backend.models import *  # noqa

with app.app_context():
    db.create_all()
    db.session.commit()

from parsing_app.parsing import parsing  # noqa
from backend import routes  # noqa
