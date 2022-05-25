from flask import Flask
from flask import jsonify, request, make_response
from flask_restful import Api
from flask_restful import Resource
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash

app = Flask(__name__)
app.config['SECRET_KEY'] = 'v-0wa-43amc=-29-30mdci230j'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://admin:12345@localhost/mydb'


api = Api(app)

db = SQLAlchemy(app)


class UserModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)


class NewsModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    img_name = db.Column(db.Text, nullable=False)

    title = db.Column(db.String(255), nullable=False)
    text = db.Column(db.Text)


class Home(Resource):
    def get(self):
        return {'Header': 'Hello world!'}, 200


class Admin(Resource):
    def get(self):
        return {'Page': 'its admin'}, 200


class Users(Resource):
    def get(self):
        users = UserModel.query.all()

        users_json = []

        for user in users:
            user_data = {}
            user_data['id'] = user.id
            user_data['username'] = user.username
            user_data['password'] = user.password
            user_data['is_admin'] = user.is_admin
            users_json.append(user_data)

        return make_response(jsonify({'users': users_json}), 200)


class Registration(Resource):
    def post(self):
        data = request.get_json()

        username = data['username']
        password = data['password']

        try:
            if db.session.query(db.exists().where(UserModel.username == username)).scalar():
                return make_response(jsonify({'error': 'Username already exists'}), 403)
            else:
                if len(password) < 6:
                    return make_response(jsonify({'error': 'Password must be at least 6 characters'}), 403)
                else:
                    hashed_password = generate_password_hash(password, 'sha256')

                    user = UserModel(username=username, password=hashed_password)
                    db.session.add(user)
                    db.session.commit()

                    return make_response(jsonify({'message': 'User created'}), 200)
        except():
            return make_response(jsonify({'error': 'Something went wrong when registering account'})), 403


class User(Resource):
    def get(self, user_id):
        user = UserModel.query.filter_by(id=user_id).first()
        if user:
            user_data = {}
            user_data['id'] = user.id
            user_data['username'] = user.username
            user_data['password'] = user.password
            user_data['is_admin'] = user.is_admin
            return make_response(jsonify({'user': user_data}), 200)
        else:
            return make_response(jsonify({'error': 'User not exist'}), 404)

    def put(self, user_id):
        data = request.get_json()
        user = UserModel.query.filter_by(id=user_id).first()

        if user:
            user_data = {}
            user_data['id'] = data['id']
            user_data['username'] = data['username']
            user_data['password'] = data['password']
            user_data['is_admin'] = data['is_admin']
            return make_response(jsonify({'user': user_data}), 200)
        else:
            return make_response(jsonify({'error': 'User not exist'}), 404)

    def delete(self, user_id):
        return ''


api.add_resource(Home, '/')
api.add_resource(Admin, '/admin')
api.add_resource(Users, '/users')
api.add_resource(User, '/user/<user_id>')
api.add_resource(Registration, '/register')

if __name__ == '__main__':
    app.run(debug=True)
