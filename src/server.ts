/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import App from './app'
import ToolController from './controllers/tool.controller'
import UserController from './controllers/user.controller'
import AuthController from './controllers/auth.controller'
import ToolJwtController from './controllers/jwt/tool.jwt.controller'

const app = new App(
  [ToolController, UserController, AuthController, ToolJwtController],
  process.env.PORT || 3000
)

app.start()

export default app
