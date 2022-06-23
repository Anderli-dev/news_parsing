from views import *

# page routes
api.add_resource(Home, '/')
api.add_resource(AdminView, '/admin')

# user routes
api.add_resource(UsersView, '/api/users')
api.add_resource(UserView, '/api/user/<user_id>')

# role and permission routes
api.add_resource(RoleView, '/api/role')
api.add_resource(PermissionView, '/api/permission')
api.add_resource(RolePermissionView, '/api/role-permission')

# authorization and authentication routes
api.add_resource(RegistrationView, '/api/register')
api.add_resource(LoginView, '/api/login')
api.add_resource(LogoutView, '/api/logout')

# news routes
api.add_resource(ImageUploader, '/api/image_upload')
api.add_resource(PostPreviewView, '/api/preview')
api.add_resource(PostView, '/api/post')
api.add_resource(PostsView, '/api/posts')
