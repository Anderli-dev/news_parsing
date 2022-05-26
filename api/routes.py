from resources import *

api.add_resource(Home, '/')
api.add_resource(Admin, '/admin')

api.add_resource(Users, '/users')
api.add_resource(User, '/user/<user_id>')

api.add_resource(Registration, '/register')
api.add_resource(Login, '/login')
