from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from apscheduler.schedulers.background import BackgroundScheduler
from parsing_app import parsing

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

app.config.from_object('backend.config')

sched = BackgroundScheduler()
sched.add_job(parsing, 'interval', seconds=int(app.config['PARSING_TIME'])*60*60, id='get_posts')

db = SQLAlchemy(app)

from backend.models import *  # noqa

with app.app_context():
    db.create_all()
    db.session.commit()

from parsing_app import parsing  # noqa
from backend import routes  # noqa
