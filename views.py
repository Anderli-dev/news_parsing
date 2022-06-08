import datetime
import os
from functools import wraps
from pathlib import Path

import jwt
from flask import jsonify, request, make_response
from flask_restful import Api
from flask_restful import Resource
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename

from app import app
from app import db
from models import Role, Profile, BlacklistToken, Permission, RolePermission, NewsPreview

api = Api(app)

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
BASE_DIR = Path(__file__).resolve().parent.parent


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def scope(scope_name):
    def wrap(f):
        def inner_wrapper(*args, **kwargs):
            token = request.headers['x-access-token']
            data = jwt.decode(token, app.config['SECRET_KEY'])

            user = Profile.query.filter_by(id=data['id']).first()
            role = Role.query.filter_by(id=user.role_id).first()
            permission_ids = RolePermission.query.filter_by(role_id=role.id).all()
            permission_ids = [p.permission_id for p in permission_ids]
            for permission_id in permission_ids:
                permission = Permission.query.filter_by(id=permission_id).first()
                if permission.name == scope_name:
                    return f(*args, **kwargs)

            return {"error": "You do not have the permission"}, 403

        return inner_wrapper

    return wrap


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token:
            return make_response(jsonify({'error': 'Token is missing!'}), 401)

        # TODO separate token and login required decorators
        blacklist_token = BlacklistToken.query.filter_by(token=token).first()
        if blacklist_token:
            return make_response(jsonify({'error': 'Authentication error!'}), 401)

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
            current_user = Profile.query.filter_by(id=data['id']).first()
        except:
            return make_response(jsonify({'error': 'Token is invalid!'}), 401)

        return f(*args, **kwargs)
    return decorated


def is_admin(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            token = request.headers['x-access-token']
            data = jwt.decode(token, app.config['SECRET_KEY'])

            user = Profile.query.filter_by(id=data['id']).first()

            role_admin = Role.query.filter_by(name='Admin').first()

            if user.role_id != role_admin.id:
                return make_response(jsonify({"error": "You do not have the permission"}), 403)
        except:
            return make_response(jsonify({'error': 'Authentication error!'}), 401)

        return f(*args, **kwargs)
    return decorated


class AuthResource(Resource):
    method_decorators = [token_required]


class AdminResource(AuthResource):
    method_decorators = [is_admin]


# Main pages
class Home(Resource):
    def get(self):
        return {'Header': 'Hello world!'}, 200


class AdminView(AuthResource):
    def get(self):
        return {'Page': 'its admin'}, 200


# Authentication and authorization
class RegistrationView(Resource):
    def post(self):
        data = request.get_json()

        username = data['username']
        password = data['password']

        try:
            if db.session.query(db.exists().where(Profile.username == username)).scalar():
                return make_response(jsonify({'error': 'Username already exists'}), 403)
            else:
                if len(password) < 6:
                    return make_response(jsonify({'error': 'Password must be at least 6 characters'}), 403)
                else:
                    hashed_password = generate_password_hash(password, 'sha256')

                    user = Profile(username=username, password=hashed_password)
                    db.session.add(user)
                    db.session.commit()

                    token = jwt.encode(
                        {'id': user.id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)},
                        app.config['SECRET_KEY']
                    )

                    return make_response(jsonify({'msg': 'User created!', 'token': token.decode('UTF-8')}), 200)
        except():
            return make_response(jsonify({'error': 'Something went wrong when registering account'})), 403


class LoginView(Resource):
    def options(self):
        return make_response(jsonify({'msg': 'success'}), 200)

    def post(self):
        auth = request.authorization

        if not auth or not auth.username or not auth.password:
            return make_response(jsonify({'error': 'Could not verify'}), 401)

        user = Profile.query.filter_by(username=auth.username).first()

        if not user:
            return make_response(jsonify({'error': 'Could not verify'}), 401)

        if check_password_hash(user.password, auth.password):
            token = jwt.encode(
                {'id': user.id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)},
                app.config['SECRET_KEY']
            )

            return make_response(jsonify({'token': token.decode('UTF-8')}), 200)

        return make_response(jsonify({'error': 'Could not verify'}), 401)


class LogoutView(AuthResource):
    def get(self):
        token = request.headers['x-access-token']
        if token:
            blacklist_token = BlacklistToken(token=token)
            try:
                db.session.add(blacklist_token)
                db.session.commit()
                return make_response(jsonify({'message': 'Logout success'}), 200)
            except:
                return make_response(jsonify({'error': 'Logout error'}), 403)
        else:
            return make_response(jsonify({'error': 'Token is missing'}), 403)


# Role and permissions
class RoleView(AdminResource):
    def get(self):

        roles = Role.query.all()

        roles_json = []

        for role in roles:
            role_data = {}
            role_data['id'] = role.id
            role_data['name'] = role.name
            roles_json.append(role_data)

        return make_response(jsonify({'roles': roles_json}), 200)

    def post(self):
        data = request.get_json()
        try:
            role_name = data['role']
            role = Role(name=role_name)
            db.session.add(role)
            db.session.commit()
            return make_response(jsonify({'message': 'Role created successful'}), 200)
        except:
            return make_response(jsonify({'error': 'Something went wrong'}), 403)


class PermissionView(AdminResource):
    def get(self):
        permissions = Permission.query.all()

        permissions_json = []

        for permission in permissions:
            permission_data = {}
            permission_data['id'] = permission.id
            permission_data['name'] = permission.name
            permissions_json.append(permission_data)

        return make_response(jsonify({'permissions': permissions_json}), 200)

    def post(self):
        data = request.get_json()
        try:
            permissions = data['permissions']
            for permission in permissions:
                db.session.add(Permission(name=permission))

            db.session.commit()
            return make_response(jsonify({'message': 'Permission created successful'}), 200)
        except:
            return make_response(jsonify({'error': 'Something went wrong'}), 403)


class RolePermissionView(AdminResource):
    def get(self):
        roles_permissions = RolePermission.query.all()

        roles_permissions_json = []

        for role_permission in roles_permissions:
            roles_permissions_data = {}
            roles_permissions_data['id'] = role_permission.id
            # TODO add if role or permission exist
            roles_permissions_data['role_id'] = role_permission.role_id
            roles_permissions_data['permission_id'] = role_permission.permission_id
            roles_permissions_json.append(roles_permissions_data)

        return make_response(jsonify({'role_permission': roles_permissions_json}), 200)

    def post(self):
        data = request.get_json()
        try:
            roles_permissions = data['roles_permissions']
            for role_permission in roles_permissions:
                role_id = role_permission['role_id']
                permission_id = role_permission['permission_id']
                db.session.add(RolePermission(role_id=role_id, permission_id=permission_id))

            db.session.commit()
            return make_response(jsonify({'message': 'To role added permissions successful'}), 200)
        except:
            return make_response(jsonify({'error': 'Something went wrong'}), 403)


# User actions
class UsersView(AdminResource):
    @scope('users:read')
    def get(self):

        users = Profile.query.all()

        users_json = []

        for user in users:
            user_data = {}
            user_data['id'] = user.id
            user_data['username'] = user.username
            user_data['password'] = user.password
            users_json.append(user_data)

        return make_response(jsonify({'users': users_json}), 200)


class UserView(AuthResource):
    @scope("user:read")
    def get(self, user_id):
        token = request.headers['x-access-token']
        data = jwt.decode(token, app.config['SECRET_KEY'])

        auth_user = Profile.query.filter_by(id=data['id']).first()
        role_admin = Role.query.filter_by(name='Admin').first()

        if user_id == str(data['id']) or auth_user.role_id == role_admin.id:
            user_get = Profile.query.filter_by(id=user_id).first()
            if user_get:
                    user_data = {}
                    user_data['id'] = user_get.id
                    user_data['username'] = user_get.username
                    user_data['password'] = user_get.password
                    return make_response(jsonify({'user': user_data}), 200)
            else:
                return make_response(jsonify({'error': 'User not exist'}), 404)
        else:
            return make_response(jsonify({'error': 'You do not have the permission'}), 403)

    @scope("user:update")
    def put(self, user_id):
        token = request.headers['x-access-token']
        data = jwt.decode(token, app.config['SECRET_KEY'])

        auth_user = Profile.query.filter_by(id=data['id']).first()
        role_admin = Role.query.filter_by(name='Admin').first()

        if user_id == str(data['id']) or auth_user.role_id == role_admin.id:
            user_get = Profile.query.filter_by(id=user_id).first()
            data = request.get_json()
            if user_get:
                user_data = {}
                user_data['id'] = data['id']
                user_data['username'] = data['username']
                user_data['password'] = data['password']
                return make_response(jsonify({'user': user_data}), 200)
            else:
                return make_response(jsonify({'error': 'User not exist'}), 404)
        else:
            return make_response(jsonify({'error': 'You do not have the permission'}), 403)

    @scope("user:delete")
    def delete(self, user_id):
        token = request.headers['x-access-token']
        data = jwt.decode(token, app.config['SECRET_KEY'])

        auth_user = Profile.query.filter_by(id=data['id']).first()
        role_admin = Role.query.filter_by(name='Admin').first()

        if user_id == str(data['id']) or auth_user.role_id == role_admin.id:
            user_get = Profile.query.filter_by(id=user_id).first()
            if user_get:
                db.session.delete(user_get)
                db.session.commit()
                return make_response(jsonify({'success': 'Delete success'}), 200)
            else:
                return make_response(jsonify({'error': 'User not exist'}), 404)
        else:
            return make_response(jsonify({'error': 'You do not have the permission'}), 403)


# News actions
class NewsPreviewView(AuthResource):
    def post(self):
        if 'img' not in request.files:
            return make_response(jsonify({'error': 'No file part'}), 403)
        file = request.files['img']
        if file.filename == '':
            return make_response(jsonify({'error': 'No selected file'}), 403)

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(BASE_DIR, app.config['UPLOAD_FOLDER'], filename))

        try:
            data = request.form

            db.session.add(NewsPreview(img=secure_filename(file.filename), title=data['title'], preview=data['preview']))
            db.session.commit()

            return make_response(jsonify({'msg': 'success saved preview'}), 200)
        except:
            return make_response(jsonify({'error': 'something went wrong'}), 403)


class NewsView(AuthResource):
    def get(self):
        pass
