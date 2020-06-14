import authServices from '../services/auth.services'
import express, { Request, Response } from 'express'
import IUser from '../interfaces/user.interface'
import userServices from '../services/user.services'
import { check } from 'express-validator'

class AuthController {
  router = express.Router()

  constructor () {
    this.initializeRoutes()
  }

  initializeRoutes (): void {
    this.router.post(
      '/auth/logIn',
      [check('username').isString(), check('password').isString()],
      this.logIn
    )
    this.router.post(
      '/auth/signIn',
      [
        check('username').isString(),
        check('name').isString(),
        check('password').isString(),
        check('email').isEmail()
      ],
      this.signIn
    )
  }

  private async logIn (
    request: Request,
    response: Response
  ): Promise<Response<any>> {
    const { username, password } = request.body

    const logIn = await authServices.logIn(username, password)

    if (logIn instanceof Error) {
      return response.send({ Error: 'Authentication Failed, user not found' })
    } else return response.status(200).send(logIn)
  }

  private async signIn (
    request: Request,
    response: Response
  ): Promise<Response<any>> {
    const user: IUser = request.body

    try {
      const insertedUser = await userServices.insert(user)
      authServices
        .logIn(insertedUser.username, request.body.password)
        .then(data => {
          return response.status(200).send(data)
        })
        .catch(err => response.status(500).send(err))
    } catch (error) {
      if (error.code === 11000) {
        return response.status(500).send({ error: 'Duplicate Keys' })
      }
      return response.status(500).send(error)
    }
  }
}

export default new AuthController()
