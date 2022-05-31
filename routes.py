from views import *

# page routes
api.add_resource(Home, '/')
api.add_resource(AdminView, '/admin')

# user routes
api.add_resource(UsersView, '/users')
api.add_resource(UserView, '/user/<user_id>')

# role and permission routes
api.add_resource(RoleView, '/role')
api.add_resource(PermissionView, '/permission')
api.add_resource(RolePermissionView, '/role-permission')

# authorization and authentication routes
api.add_resource(RegistrationView, '/register')
api.add_resource(LoginView, '/login')
api.add_resource(LogoutView, '/logout')

