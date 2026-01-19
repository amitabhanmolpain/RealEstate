from flask import Blueprint, request
from flask_restful import Api, Resource
from app.controllers.auth_controller import register_user, login_user

auth_bp = Blueprint("auth", __name__)
api = Api(auth_bp)

class Register(Resource):
    def post(self):
        data = request.get_json()
        return register_user(data)

class Login(Resource):
    def post(self):
        data = request.get_json()
        return login_user(data)

api.add_resource(Register, "/auth/register")
api.add_resource(Login, "/auth/login")
