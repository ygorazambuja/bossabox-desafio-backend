/* eslint-disable @typescript-eslint/restrict-template-expressions */
import App from '../../app'
import supertest from 'supertest'
import * as faker from 'faker'

import UserController from '../../controllers/user.controller'

import IUser from '../../interfaces/user.interface'
import userModel from '../../models/user.model'
import userServices from '../../services/user.services'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000

let app

beforeAll(async () => {
  app = new App([UserController], 3000)
  await truncateTable()
})

const genNewUser = (): IUser => {
  return {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    username: faker.internet.userName()
  }
}

const populateBank = async (): Promise<void> => {
  for (let count = 0; count < 10; count++) {
    await userServices.insert(genNewUser())
  }
}
const truncateTable = async (): Promise<void> => {
  await userModel.remove({})
}
afterEach(async () => {
  await truncateTable()
})

describe('Test the User Router', () => {
  it('should create a new user', async () => {
    const user = genNewUser()

    const { body } = await supertest(app.app)
      .post('/users')
      .send(user)

    expect(body._id).not.toBeNull()
    expect(body.name).toBe(user.name)
    expect(body.password).not.toBe(user.password)
    expect(body.email).toBe(user.email)
    expect(body.__v).not.toBeNull()
  })

  it('should delete a user', async () => {
    const user = genNewUser()

    const { body } = await supertest(app.app)
      .post('/users')
      .send(user)

    expect(body._id).not.toBeNull()
    expect(body.name).toBe(user.name)
    expect(body.password).not.toBe(user.password)
    expect(body.email).toBe(user.email)
    expect(body.__v).not.toBeNull()

    const deletedUser = await supertest(app.app).delete(`/users/${body._id}`)

    expect(deletedUser.status).toBe(204)
  })

  it('should update a user', async () => {
    const user = genNewUser()

    const { body } = await supertest(app.app)
      .post('/users')
      .send(user)

    const updateUserResponse = await supertest(app.app)
      .put('/users')
      .send({
        ...body,
        name: 'Node Rocks'
      })

    const updateUserBody = updateUserResponse.body

    expect(updateUserBody.name).toBe('Node Rocks')
    expect(updateUserBody.password).not.toBeNull()
    expect(updateUserBody.username).toBe(user.username)
  })

  it('should get all users', async () => {
    await truncateTable()

    await populateBank()

    const { body } = await supertest(app.app).get('/users')

    expect(body).toBeInstanceOf(Array)
    expect(body.length).toBe(10)
    expect(body[0]._id).not.toBeNull()
    expect(body[1]._id).not.toBeNull()
    expect(body[2]._id).not.toBeNull()
    expect(body[3]._id).not.toBeNull()
    expect(body[4]._id).not.toBeNull()
    expect(body[5]._id).not.toBeNull()
    expect(body[6]._id).not.toBeNull()
    expect(body[7]._id).not.toBeNull()
    expect(body[8]._id).not.toBeNull()
    expect(body[9]._id).not.toBeNull()
  })
})
