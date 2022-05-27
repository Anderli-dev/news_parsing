from app import db


class UserModel(db.Model):
    __abstract__ = True
    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    role_id = db.Column(db.Integer)


class Admin(UserModel):
    pass


class Editor(UserModel):
    news = db.relationship('News', backref='editor', lazy=True)


class News(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    img_name = db.Column(db.Text, nullable=False)

    title = db.Column(db.String(255), nullable=False)
    text = db.Column(db.Text)

    editor_id = db.Column(db.Integer, db.ForeignKey('editor.id'),
                          nullable=False)

