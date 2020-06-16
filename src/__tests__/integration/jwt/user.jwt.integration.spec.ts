/* eslint-disable @typescript-eslint/restrict-template-expressions */
import App from '../../../app'
import supertest from 'supertest'
import * as faker from 'faker'

import IUser from '../../../interfaces/user.interface'
import IAuth from '../../../interfaces/auth.interface'
import userModel from '../../../models/user.model'
import userServices from '../../../services/user.services'
import dotenv from 'dotenv'

import { MongoMemoryServer } from 'mongodb-memory-server'
import UserJwtController from '../../../controllers/jwt/user.jwt.controller'
import authServices from '../../../services/auth.services'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000

let app
let mongoServer

beforeAll(async () => {
  dotenv.config({
    path: '.env.testing'
  })
  mongoServer = new MongoMemoryServer()
  const mongoUri = await mongoServer.getUri()
  process.env.MONGODB_URI = mongoUri

  app = new App([UserJwtController], 3000)
  await truncateTable()
})

const getValidAuthentication = async (): Promise<IAuth> => {
  const user = genNewUser()
  return await authServices.signIn(user)
}

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
    const { token } = await getValidAuthentication()
    const { body } = await supertest(app.app)
      .post('/jwt/users')
      .send(user)
      .set({ authorization: token })

    expect(body._id).not.toBeNull()
    expect(body.name).toBe(user.name)
    expect(body.password).not.toBe(user.password)
    expect(body.email).toBe(user.email)
    expect(body.__v).not.toBeNull()
  })

  it('should delete a user', async () => {
    const user = genNewUser()
    const { token } = await getValidAuthentication()
    const { body } = await supertest(app.app)
      .post('/jwt/users')
      .send(user)
      .set({ authorization: token })

    expect(body._id).not.toBeNull()
    expect(body.name).toBe(user.name)
    expect(body.password).not.toBe(user.password)
    expect(body.email).toBe(user.email)
    expect(body.__v).not.toBeNull()

    const deletedUser = await supertest(app.app)
      .delete(`/jwt/users/${body._id}`)
      .set({ authorization: token })

    expect(deletedUser.status).toBe(204)
  })

  it('should update a user', async () => {
    const user = genNewUser()
    const { token } = await getValidAuthentication()
    const { body } = await supertest(app.app)
      .post('/jwt/users')
      .send(user)
      .set({ authorization: token })

    const updateUserResponse = await supertest(app.app)
      .put('/jwt/users')
      .send({
        ...body,
        name: 'Node Rocks'
      })
      .set({ authorization: token })

    const updateUserBody = updateUserResponse.body

    expect(updateUserBody.name).toBe('Node Rocks')
    expect(updateUserBody.password).not.toBeNull()
    expect(updateUserBody.username).toBe(user.username)
  })

  it('should get all users', async () => {
    await truncateTable()

    await populateBank()
    const { token } = await getValidAuthentication()
    const { body } = await supertest(app.app)
      .get('/jwt/users')
      .set({ authorization: token })

    expect(body).toBeInstanceOf(Array)
    expect(body.length).toBeGreaterThanOrEqual(10)
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

  it('should get a user with the ID', async () => {
    await truncateTable()
    const user = genNewUser()
    const { token } = await getValidAuthentication()
    const postResponse = await supertest(app.app)
      .post('/jwt/users')
      .send(user)
      .set({ authorization: token })

    const getByIdResponse = await supertest(app.app)
      .get(`/jwt/users/${postResponse.body._id}`)
      .set({ authorization: token })

    expect(getByIdResponse.body.name).toBe(user.name)
    expect(getByIdResponse.body.password).not.toBe(user.password)
    expect(getByIdResponse.body.email).toBe(user.email)
    expect(getByIdResponse.body.__v).not.toBeNull()
  })
})
