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
    id = db.Column(db.Integer, primary_key=True)

    img_name = db.Column(db.Text, nullable=False)

    title = db.Column(db.String(255), nullable=False)
    text = db.Column(db.Text)

    editor_id = db.Column(db.Integer, db.ForeignKey('editor.profile_id'),
                          nullable=False)


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

