import datetime

from backend import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(50))
    surname = db.Column(db.String(50))
    email = db.Column(db.String(50))

    username = db.Column(db.String(50), nullable=False, unique=True)

    password = db.Column(db.String(255), nullable=False)

    role_id = db.Column(db.Integer)


class NewsPreview(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, unique=True)

    img = db.Column(db.Text, nullable=False)

    posted_at = db.Column(db.DateTime, nullable=False)
    title = db.Column(db.String(255), nullable=False)
    preview = db.Column(db.Text, nullable=True)
    is_parsed = db.Column(db.Boolean, default=False, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                        nullable=True)

    news = db.relationship("News", uselist=False, backref="news_preview")


class News(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)

    title = db.Column(db.String(255), nullable=False)

    text = db.Column(db.Text)

    preview_id = db.Column(db.Integer, db.ForeignKey('news_preview.id'),
                        nullable=True)


class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(60))
    description = db.Column(db.Text)


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
