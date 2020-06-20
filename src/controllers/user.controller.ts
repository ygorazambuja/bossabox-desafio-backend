import userServices from '@services/user.services'
import { IUser } from '@interfaces/user.interface'
import { Request, Response, Router } from 'express'
import { check } from 'express-validator'

class UserController {
  router = Router()

  constructor () {
    this.initializeRoutes()
  }

  initializeRoutes (): void {
    this.router.get('/users', this.getUsers)
    this.router.post(
      '/users',
      [
        check('username').isString(),
        check('email').isEmail(),
        check('password').isString(),
        check('name').isString()
      ],
      this.addUser
    )
    this.router.delete('/users/:id', this.deleteUser)
    this.router.get('/users/:id', this.getUserById)
    this.router.put('/users', [check('_id').isString()], this.updateUser)
  }

  private async getUsers (
    request: Request,
    response: Response
  ): Promise<Response<void>> {
    try {
      const users = await userServices.getAll()
      return response.status(200).send(users)
    } catch (error) {
      return response.status(500).send(error)
    }
  }

  private async getUserById (
    request: Request,
    response: Response
  ): Promise<Response<void>> {
    const { id } = request.params
    const user = await userServices.getById(id)
    if (!(user === null) || !(user === undefined)) {
      return response.status(200).send(user)
    } else {
      return response.status(404).send({ error: 'User not found' })
    }
  }

  private async addUser (
    request: Request,
    response: Response
  ): Promise<Response<void>> {
    try {
      const user: IUser = request.body
      const insertedUser = await userServices.insert(user)
      return response.status(201).send(insertedUser)
    } catch (error) {
      return response.status(500).send(error)
    }
  }

  private async deleteUser (
    request: Request,
    response: Response
  ): Promise<Response<void>> {
    try {
      const { id } = request.params

      const userDeleted = userServices.delete(id)
      if (userDeleted !== null) return response.status(204).send()
    } catch (err) {
      return response.status(500).send(err)
    }
  }

  private async updateUser (
    request: Request,
    response: Response
  ): Promise<Response<void>> {
    const status = await userServices.update(request.body)
    const { _id } = request.body
    try {
      if (status.nModified === 1) {
        const tool = await userServices.getById(_id)
        return response.status(200).send(tool)
      }
    } catch (error) {
      return response.status(500).send(error)
    }
  }
}

export default new UserController()
