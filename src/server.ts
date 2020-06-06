import App from './app'
import ToolController from './controllers/tool.controller'
import UserController from './controllers/user.controller'
import AuthController from './controllers/auth.controller'

const app = new App(
  [ToolController, UserController, AuthController],
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  process.env.PORT || 3000
)

export default app
