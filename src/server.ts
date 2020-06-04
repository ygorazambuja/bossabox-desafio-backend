import App from './app'
import ToolController from './controllers/tool.controller'
import UserController from './controllers/user.controller'
import AuthController from './controllers/auth.controller'

const app = new App([ToolController, UserController, AuthController])

export default app
