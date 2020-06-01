import userServices from './user.services'
import IUser from './user.interface'
import express, { Request, Response } from 'express'
class UserController {
  router = express.Router()

  constructor () {
    this.initializeRoutes()
  }

  initializeRoutes (): void {
    this.router.get('/users', this.getUsers)
    this.router.post('/users', this.addUser)
    this.router.delete('/users/:id', this.deleteUser)
    this.router.put('/users', this.updateUser)
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
