/* eslint-disable @typescript-eslint/no-unused-vars */
import * as faker from 'faker'
import { IUser } from '@interfaces/user.interface'
import supertest from 'supertest'
import App from '../../app'
import AuthController from '@controllers/auth.controller'
import authServices from '@services/auth.services'
import dotenv from 'dotenv'
import { MongoMemoryServer } from 'mongodb-memory-server'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000

let mongoServer: MongoMemoryServer
let app

beforeAll(async () => {
  dotenv.config({
    path: '.env.testing'
  })
  mongoServer = new MongoMemoryServer()
  const mongoUri = await mongoServer.getUri()
  process.env.MONGODB_URI = mongoUri
  app = new App([AuthController], 3000)
})

const genNewUser = (): IUser => {
  const user: IUser = {
    name: faker.name.firstName(0),
    email: faker.internet.email(),
    password: faker.internet.password(8),
    username: faker.internet.userName()
  }
  return user
}

describe('Test the AuthRoutes', () => {
  it('should do the Sign In', async () => {
    const user = genNewUser()
    const { body } = await supertest(app.app)
      .post('/auth/signIn')
      .send(user)

    expect(body.username).toBe(user.username)
    expect(body.token).not.toBeNull()
  })

  it('should do the Log In', async () => {
    const user = genNewUser()

    await authServices.signIn(user)

    const { body } = await supertest(app.app)
      .post('/auth/logIn')
      .send({
        username: user.username,
        password: user.password
      })

    expect(body.username).toBe(user.username)
    expect(body.token).not.toBeNull()
  })

  it('should have a failed Log In', async () => {
    const user = genNewUser()

    const response = await supertest(app.app)
      .post('/auth/logIn')
      .send({
        username: user.username,
        password: user.password
      })

    expect(response.body.Error).toBe('Authentication Failed, user not found')
  })

  it('should get a error when not receive all the arguments to create a user', async () => {
    const user = genNewUser()

    delete user.name
    const { body } = await supertest(app.app)
      .post('/auth/signIn')
      .send(user)

    expect(body._message).toBe('User validation failed')
  })
})
