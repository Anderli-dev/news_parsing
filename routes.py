from views import *

api.add_resource(Home, '/')
api.add_resource(AdminView, '/admin')

api.add_resource(UsersView, '/users')
api.add_resource(UserView, '/user/<user_id>')
api.add_resource(RoleView, '/role')
api.add_resource(PermissionView, '/permission')
api.add_resource(RolePermissionView, '/role-permission')

api.add_resource(RegistrationView, '/register')
api.add_resource(LoginView, '/login')
api.add_resource(LogoutView, '/logout')

