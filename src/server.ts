import App from './app'
import ToolController from './tool/tool.controller'
import UserController from './user/user.controller'

const app = new App([ToolController, UserController], 3000)

app.listen()
