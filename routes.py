from views import *

# user routes
api.add_resource(UsersView, '/api/users')
api.add_resource(UserView, '/api/user/<user_id>')
api.add_resource(UsersSearchView, '/api/user/search')
api.add_resource(UserPermissionView, '/api/user/permissions')

# role and permission routes
api.add_resource(RolesView, '/api/roles')
api.add_resource(RoleView, '/api/role', '/api/role/<role_id>')
api.add_resource(PermissionsView, '/api/permissions')
api.add_resource(RolePermissionsView, '/api/role-permissions', '/api/role-permissions/<role_id>')

# authorization and authentication routes
api.add_resource(RegistrationView, '/api/register')
api.add_resource(LoginView, '/api/login')
api.add_resource(LogoutView, '/api/logout')

# news routes
api.add_resource(ImageUploader, '/api/image_upload')
api.add_resource(PostPreviewView, '/api/preview', '/api/preview/<id>')
api.add_resource(PostsPreviewView, '/api/posts_preview')
api.add_resource(PostView, '/api/post', '/api/post/<id>')
api.add_resource(PostsView, '/api/posts')
api.add_resource(PostsSearchView, '/api/post/search')
