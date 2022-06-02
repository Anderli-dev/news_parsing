from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

app.config.from_object('config')

db = SQLAlchemy(app)
migrate = Migrate(app, db)

from models import *

db.create_all()
db.session.commit()
