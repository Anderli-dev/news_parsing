import datetime
import os
from functools import wraps
from pathlib import Path

import jwt
from flask import jsonify, request, make_response
from flask_restful import Api
from flask_restful import Resource
from sqlalchemy import func
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename

from app import app
from app import db
from models import Role, User, BlacklistToken, Permission, RolePermission, NewsPreview, News

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

            user = User.query.filter_by(id=data['id']).first()
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
            current_user = User.query.filter_by(id=data['id']).first()
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

            user = User.query.filter_by(id=data['id']).first()

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


# Authentication and authorization
class RegistrationView(Resource):
    def options(self):
        return make_response(jsonify({'msg': 'success'}), 200)

    def post(self):
        data = request.get_json()

        username = data['username']
        password = data['password']
        re_password = data['re_password']
        # TODO check re_password
        try:
            if db.session.query(db.exists().where(User.username == username)).scalar():
                return make_response(jsonify({'error': 'Username already exists'}), 403)
            else:
                if len(password) < 6:
                    return make_response(jsonify({'error': 'Password must be at least 6 characters'}), 403)
                else:
                    hashed_password = generate_password_hash(password, 'sha256')

                    user = User(username=username,
                                password=hashed_password,
                                role_id=Role.query.filter_by(name='BaseUser').first().id)
                    db.session.add(user)
                    db.session.commit()

                    token = jwt.encode(
                        {'id': user.id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)},
                        app.config['SECRET_KEY']
                    )

                    return make_response(jsonify({'msg': 'User created!', 'token': token.decode('UTF-8')}), 200)
        except Exception as e:
            print(e)
            return make_response(jsonify({'error': 'Something went wrong when registering account'})), 403


class LoginView(Resource):
    def options(self):
        return make_response(jsonify({'msg': 'success'}), 200)

    def post(self):
        auth = request.authorization

        if not auth or not auth.username or not auth.password:
            return make_response(jsonify({'error': 'Could not verify'}), 401)

        user = User.query.filter_by(username=auth.username).first()

        if not user:
            return make_response(jsonify({'error': 'Could not verify'}), 401)

        if check_password_hash(user.password, auth.password):
            token = jwt.encode(
                {'id': user.id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(weeks=1)},
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


def check_role_permission():
    pass


# Role and permissions
class RolesView(AuthResource):
    @scope('roles:read')
    def get(self):
        roles = Role.query.all()

        roles_json = []

        for role in roles:
            role_data = {}
            role_data['id'] = role.id
            role_data['name'] = role.name
            roles_json.append(role_data)

        return make_response(jsonify({'roles': roles_json}), 200)


class RoleView(AuthResource):
    @scope('role:read')
    def get(self, role_id):
        role = Role.query.filter_by(id=role_id).first()
        if role:
            role_users = User.query.filter_by(role_id=role.id).count()
            role_data = {}
            role_data['id'] = role.id
            role_data['name'] = role.name
            role_data['role_users'] = role_users
            role_data['description'] = role.description
            return make_response(jsonify({'role': role_data}), 200)
        else:
            return make_response(jsonify({'error': 'Role not exist'}), 404)

    @scope('role:create')
    def post(self):
        data = request.get_json()
        try:
            role_name = data['role_name']
            role_description = data['role_description']
            role = Role(name=role_name, description=role_description)
            db.session.add(role)
            db.session.commit()

            for permission in data['role_permissions']:
                perm = Permission.query.filter_by(name=str(permission['name'])).first()
                role_permission = RolePermission(role_id=role.id,
                                                 permission_id=perm.id)
                db.session.add(role_permission)
                db.session.commit()

            return make_response(jsonify({'message': 'Role created successful'}), 200)
        except:
            return make_response(jsonify({'error': 'Something went wrong'}), 403)

    @scope("role:update")
    def put(self, role_id):
        data = request.get_json()
        role = Role.query.filter_by(id=role_id).first()
        if role:
            if data.get('role_name'):
                role.name = data['role_name']
            if data.get('description'):
                role.description = data['description']
            db.session.commit()
            return make_response(jsonify({'success': 'Role updated successfully'}), 200)
        else:
            return make_response(jsonify({'error': 'Role not exist'}), 404)

    @scope("role:delete")
    def delete(self, role_id):
        role = Role.query.filter_by(id=role_id).first()
        if role:
            role_users = User.query.filter_by(role_id=role.id).all()
            for user in role_users:
                user.role_id = Role.query.filter_by(name='BaseUser').first().id
            db.session.delete(role)
            db.session.commit()
            return make_response(jsonify({'success': 'Delete success'}), 200)
        else:
            return make_response(jsonify({'error': 'Role not exist'}), 404)


class PermissionsView(AuthResource):
    @scope('permissions:read')
    def get(self):
        permissions = Permission.query.all()

        permissions_json = []

        for permission in permissions:
            permission_data = {}
            permission_data['id'] = permission.id
            permission_data['name'] = permission.name
            permissions_json.append(permission_data)

        return make_response(jsonify({'permissions': permissions_json}), 200)


class RolePermissionsView(AuthResource):
    @scope('role_permissions:read')
    def get(self, role_id):
        roles_permissions = RolePermission.query.filter_by(role_id=role_id)

        role_permissions_json = []
        not_applied_permissions_json = []

        not_applied_permissions = Permission.query

        try:
            for role_permission in roles_permissions:
                permissions_data = {}
                permission = Permission.query.filter_by(id=role_permission.permission_id).first()
                permissions_data['id'] = permission.id
                permissions_data['name'] = permission.name
                role_permissions_json.append(permissions_data)
                not_applied_permissions = not_applied_permissions.filter(Permission.id != role_permission.permission_id)

            for permission in not_applied_permissions.all():
                permissions_data = {}
                permission = Permission.query.filter_by(id=permission.id).first()
                permissions_data['id'] = permission.id
                permissions_data['name'] = permission.name
                not_applied_permissions_json.append(permissions_data)

            return make_response(jsonify({'role_permissions': role_permissions_json,
                                          'not_applied_permissions': not_applied_permissions_json}), 200)
        except Exception as e:
            print(e)
            return make_response(jsonify({'error': 'something went wrong'}), 403)

    @scope('role_permissions:create')
    def post(self):
        data = request.get_json()
        try:
            role_id = data['role_id']
            role_allowed_permissions = RolePermission.query.filter(
                RolePermission.role_id == role_id,
                RolePermission.permission_id.notin_([i['id'] for i in data['role_permissions']])
                ).all()
            role_permissions = data['role_permissions']

            def check_permissions():
                if not role_allowed_permissions:
                    allowed_permissions = RolePermission.query.filter(
                        RolePermission.role_id == role_id,
                        RolePermission.permission_id.in_([i['id'] for i in data['role_permissions']])
                    ).all()

                    for role_permission in role_permissions:
                        if int(role_permission['id']) not in [int(x.permission_id) for x in allowed_permissions]:
                            permission_id = role_permission['id']
                            db.session.add(RolePermission(role_id=role_id, permission_id=permission_id))
                    db.session.commit()
                    return make_response(jsonify({'message': 'To role added permissions successful'}), 200)
                else:

                    for role_allowed_permission in role_allowed_permissions:
                        db.session.delete(role_allowed_permission)
                        role_allowed_permissions.remove(role_allowed_permission)
                        db.session.commit()

                    check_permissions()

            check_permissions()

        except Exception as e:
            print(e)
            return make_response(jsonify({'error': 'Something went wrong'}), 403)


# User actions
class UsersView(AuthResource):
    @scope('users:read')
    def get(self):

        users = User.query.all()

        users_json = []

        for user in users:
            user_data = {}
            user_data['id'] = user.id
            user_data['username'] = user.username
            user_data['password'] = user.password
            user_data['role'] = Role.query.filter_by(id=user.role_id).first().name
            users_json.append(user_data)

        return make_response(jsonify({'users': users_json}), 200)


class UsersSearchView(AuthResource):
    @scope('users:read')
    def post(self):
        data = request.get_json()

        users = User.query.filter(User.username.like('%'+data['username']+'%')).all()

        users_json = []

        for user in users:
            user_data = {}
            user_data['id'] = user.id
            user_data['username'] = user.username
            user_data['password'] = user.password
            user_data['role'] = Role.query.filter_by(id=user.role_id).first().name
            users_json.append(user_data)

        return make_response(jsonify({'users': users_json}), 200)


class UserView(AuthResource):
    @scope("user:read")
    def get(self, user_id):
        token = request.headers['x-access-token']
        data = jwt.decode(token, app.config['SECRET_KEY'])

        auth_user = User.query.filter_by(id=data['id']).first()
        role_admin = Role.query.filter_by(name='Admin').first()

        if user_id == str(data['id']) or auth_user.role_id == role_admin.id:
            user_get = User.query.filter_by(id=user_id).first()
            if user_get:
                    user_data = {}
                    user_data['id'] = user_get.id
                    user_data['username'] = user_get.username
                    user_data['password'] = user_get.password
                    role = Role.query.filter_by(id=user_get.role_id).first()
                    user_data['role'] = role.name
                    return make_response(jsonify({'user': user_data}), 200)
            else:
                return make_response(jsonify({'error': 'User not exist'}), 404)
        else:
            return make_response(jsonify({'error': 'You do not have the permission'}), 403)

    @scope("user:update")
    def put(self, user_id):
        data = request.get_json()
        print(data)
        try:
            user = User.query.filter_by(id=user_id).first()
            user.username = data['username']
            user.role_id = Role.query.filter_by(name=data['role']).first().id
            db.session.commit()
            return make_response(jsonify({'msg': 'Success'}), 200)
        except Exception as e:
            print(e)
            return make_response(jsonify({'Error': 'User update error'}), 403)

    @scope("user:delete")
    def delete(self, user_id):
        token = request.headers['x-access-token']
        data = jwt.decode(token, app.config['SECRET_KEY'])

        auth_user = User.query.filter_by(id=data['id']).first()
        role_admin = Role.query.filter_by(name='Admin').first()

        if user_id == str(data['id']) or auth_user.role_id == role_admin.id:
            user_get = User.query.filter_by(id=user_id).first()
            if user_get:
                db.session.delete(user_get)
                db.session.commit()
                return make_response(jsonify({'success': 'Delete success'}), 200)
            else:
                return make_response(jsonify({'error': 'User not exist'}), 404)
        else:
            return make_response(jsonify({'error': 'You do not have the permission'}), 403)


class UserPermissionView(AuthResource):
    def get(self):
        token = request.headers['x-access-token']
        data = jwt.decode(token, app.config['SECRET_KEY'])
        current_user = User.query.filter_by(id=data['id']).first()
        user_permissions = RolePermission.query.filter_by(role_id=current_user.role_id)

        user_permissions_json = []

        try:
            for role_permission in user_permissions:
                permission = Permission.query.filter_by(id=role_permission.permission_id).first()
                user_permissions_json.append(permission.name)

            return make_response(jsonify({'user_permissions': user_permissions_json}), 200)

        except:
            return make_response(jsonify({'error': 'Something went wrong'}), 403)


# News actions
# TODO add auth res
class ImageUploader(Resource):
    @scope('img:create')
    def post(self):
        file = request.files['file']
        filename = secure_filename(file.filename)

        if file and allowed_file(file.filename):
            file.save(os.path.join(BASE_DIR, app.config['UPLOAD_FOLDER'], filename))
            return make_response(jsonify({'location': 'uploads/'+file.filename}), 200)
        else:
            make_response(jsonify({'error': 'Invalid Upload only png, jpg, jpeg, gif'}), 200)


class PostsView(Resource):
    def get(self):
        posts = NewsPreview.query.all()

        posts_json = []

        for post in posts:
            post_data = {}
            post_data['preview_id'] = post.id
            post_data['img'] = post.img
            post_data['posted_at'] = post.posted_at
            post_data['title'] = post.title
            post_data['preview'] = post.preview
            post_data['post_id'] = News.query.filter_by(preview_id=post.id).first().id
            posts_json.append(post_data)

        return make_response(jsonify({'posts': posts_json}), 200)


@app.route('/api/get_preview')
# TODO add auth res and permission
def get_three_preview():
    # TODO catch if preview less then 3
    try:
        post_id = request.args.get('post_id')
        first, second, third = NewsPreview.query.filter(NewsPreview.id != post_id, func.random())[:3]

        previews_json = []

        for preview in first, second, third:
            preview_data = {}
            preview_data['preview_id'] = preview.id
            preview_data['img'] = preview.img
            preview_data['title'] = preview.title
            preview_data['post_id'] = News.query.filter_by(preview_id=preview.id).first().id
            previews_json.append(preview_data)
        return make_response(jsonify({'data': previews_json}), 200)
    except Exception as e:
        print(e)


class PostPreviewView(Resource):
    @token_required
    @scope('post_preview:create')
    def post(self):
        # TODO limit image size
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
            date_without_timezone = str(data['posted_at'].split('+')[0])
            date = datetime.datetime.strptime(date_without_timezone, '%Y-%m-%dT%H:%M:%S')

            token = request.headers['x-access-token']
            token_data = jwt.decode(token, app.config['SECRET_KEY'])

            preview = NewsPreview(
                img=secure_filename(file.filename),
                title=data['title'],
                posted_at=date,
                preview=data['preview'],
                user_id=token_data['id'])

            db.session.add(preview)
            db.session.commit()

            return make_response(jsonify({'msg': 'success saved preview', 'previewId': preview.id}), 200)
        except Exception as e:
            print(e)
            return make_response(jsonify({'error': 'something went wrong'}), 403)

    def get(self, id):
        try:
            preview = NewsPreview.query.filter_by(id=id).first()
            return make_response(jsonify({'title': preview.title, 'img': preview.img}), 200)
        except:
            return make_response(jsonify({'title': preview.title, 'img': preview.img}), 200)


class PostView(Resource):
    @token_required
    @scope('post:create')
    def post(self):
        try:
            post = News(title=request.form.get('title_post'),
                        text=request.form.get('text'),
                        preview_id=request.form.get('previewId'))
            db.session.add(post)
            db.session.commit()

            return make_response(jsonify({'msg': 'post success saved'}), 200)
        except Exception as e:
            print(e)
            return make_response(jsonify({'error': 'something went wrong'}), 403)

    def get(self, id):
        post = News.query.filter_by(id=id).first()

        return make_response(jsonify({'title': post.title, 'body': post.text}), 200)
