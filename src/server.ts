import App from './app'
import ToolController from './tool/tool.controller'
import UserController from './user/user.controller'
import AuthController from './auth/auth.controller'

const app = new App([ToolController, UserController, AuthController], 3000)

app.listen()
