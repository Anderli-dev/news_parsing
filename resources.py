import datetime
from functools import wraps

import jwt
from flask import jsonify, request, make_response
from flask_restful import Api
from flask_restful import Resource
from werkzeug.security import generate_password_hash, check_password_hash

from models import UserModel
from app import app
from app import db

api = Api(app)


def token_required(f):
    @wraps(f)
    def decorated(self, *args, **kwargs):
        token = None

        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token:
            return make_response(jsonify({'error': 'Token is missing!'}), 401)

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
            current_user = UserModel.query.filter_by(id=data['id']).first()
        except:
            return make_response(jsonify({'error': 'Token is invalid!'}), 401)

        return f(self, current_user, *args, **kwargs)
    return decorated


class ProtectedResource(Resource):
    method_decoratos = [token_required]


class Home(Resource):
    def get(self):
        return {'Header': 'Hello world!'}, 200


class Admin(ProtectedResource):
    def get(self):
        return {'Page': 'its admin'}, 200


class Users(ProtectedResource):
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

                    token = jwt.encode(
                        {'id': user.id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)},
                        app.config['SECRET_KEY']
                    )

                    return make_response(jsonify({'msg': 'User created!', 'token': token.decode('UTF-8')}), 200)
        except():
            return make_response(jsonify({'error': 'Something went wrong when registering account'})), 403


class Login(Resource):
    def post(self):
        auth = request.authorization

        if not auth or not auth.username or not auth.password:
            return make_response(jsonify({'error': 'Could not verify'}), 401)

        user = UserModel.query.filter_by(username=auth.username).first()

        if not user:
            return make_response(jsonify({'error': 'Could not verify'}), 401)

        if check_password_hash(user.password, auth.password):
            token = jwt.encode(
                {'id': user.id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)},
                app.config['SECRET_KEY']
            )

            return make_response(jsonify({'token': token.decode('UTF-8')}), 200)

        return make_response(jsonify({'error': 'Could not verify'}), 401)


class User(ProtectedResource):
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
        user = UserModel.query.filter_by(id=user_id).first()
        if user:
            db.session.delete(user)
            db.session.commit()
            return make_response(jsonify({'success': 'Delete success'}), 200)
        else:
            return make_response(jsonify({'error': 'User not exist'}), 404)
