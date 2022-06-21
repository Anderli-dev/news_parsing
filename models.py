import datetime

from sqlalchemy.orm import backref

from app import db


class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    role_id = db.Column(db.Integer)
    user_type = db.relationship('Editor', uselist=False, lazy=True)


class Editor(db.Model):
    __table_args__ = (
        db.PrimaryKeyConstraint('profile_id'),
    )
    profile_id = db.Column(db.Integer, db.ForeignKey('profile.id'), nullable=False)
    news = db.relationship('News', backref='editor', lazy=True)


class News(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=True)

    title = db.Column(db.String(255), nullable=False)

    text = db.Column(db.Text)

    preview_id = db.Column(db.Integer, db.ForeignKey('news_preview.id'),
                        nullable=True)
    editor_id = db.Column(db.Integer, db.ForeignKey('editor.profile_id'),
                          nullable=True)


class NewsPreview(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=True)

    img = db.Column(db.Text, nullable=False)

    posted_at = db.Column(db.DateTime, nullable=False)
    title = db.Column(db.String(255), nullable=False)
    preview = db.Column(db.String(255), nullable=True)

    news = db.relationship("News", uselist=False, backref="news_preview")


class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(60))


class Permission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(60))


class RolePermission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    role_id = db.Column(db.Integer)
    permission_id = db.Column(db.Integer)


class BlacklistToken(db.Model):
    __tablename__ = 'blacklist_tokens'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    token = db.Column(db.String(500), unique=True, nullable=False)
    blacklisted_on = db.Column(db.DateTime, nullable=False)

    def __init__(self, token):
        self.token = token
        self.blacklisted_on = datetime.datetime.now()
