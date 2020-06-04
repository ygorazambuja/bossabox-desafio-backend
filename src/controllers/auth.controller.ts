import authServices from '../services/auth.services'
import express, { Request, Response } from 'express'
import IUser from '../interfaces/user.interface'
import userServices from '../services/user.services'
import AuthInterface from '../interfaces/auth.interface'

class AuthController {
  router = express.Router()

  constructor () {
    this.initializeRoutes()
  }

  initializeRoutes (): void {
    this.router.post('/auth/logIn', this.logIn)
    this.router.post('/auth/signIn', this.signIn)
  }

  private async logIn (
    request: Request,
    response: Response
  ): Promise<Response<any>> {
    const { username, password } = request.body

    try {
      const resp: AuthInterface = await authServices.logIn(username, password)
      return response.status(200).send(resp)
    } catch (error) {
      return response.status(401).send(error)
    }
  }

  private async signIn (
    request: Request,
    response: Response
  ): Promise<Response<any>> {
    const user: IUser = request.body

    try {
      const insertedUser = await userServices.insert(user)
      const authentication: AuthInterface = await authServices.logIn(
        insertedUser.username,
        insertedUser.password
      )

      return response.status(200).send(authentication)
    } catch (error) {
      if (error.code === 11000) {
        return response.status(500).send({ error: 'Duplicate Keys' })
      }
      return response.status(500).send(error)
    }
  }
}

export default new AuthController()
