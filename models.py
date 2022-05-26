from app import db


class UserModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)


# class Editor(UserModel):
#     is_editor = db.Column(db.Boolean, default=False)
#     news = db.relationship('News', backref='editor', lazy=True)


class News(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    img_name = db.Column(db.Text, nullable=False)

    title = db.Column(db.String(255), nullable=False)
    text = db.Column(db.Text)
