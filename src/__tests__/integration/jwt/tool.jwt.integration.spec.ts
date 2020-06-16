/* eslint-disable @typescript-eslint/restrict-template-expressions */
import App from '../../../app'
import supertest from 'supertest'
import * as faker from 'faker'

import toolServices from '../../../services/tool.services'
import ITool from '../../../interfaces/tool.interface'
import IUser from '../../../interfaces/user.interface'
import IAuth from '../../../interfaces/auth.interface'
import toolModel from '../../../models/tool.model'
import dotenv from 'dotenv'
import { MongoMemoryServer } from 'mongodb-memory-server'
import ToolJwtController from '../../../controllers/jwt/tool.jwt.controller'
import authServices from '../../../services/auth.services'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000
let mongoServer
let app
beforeAll(async () => {
  dotenv.config({
    path: '.env.testing'
  })
  mongoServer = new MongoMemoryServer()
  const mongoUri = await mongoServer.getUri()
  process.env.MONGODB_URI = mongoUri
  app = new App([ToolJwtController], 3000)
})

const genNewTool = (): ITool => {
  return {
    title: faker.lorem.word(),
    description: faker.lorem.paragraph(1),
    tags: ['node', 'express', 'todo', 'organization'],
    link: faker.internet.url()
  }
}

const getValidAuthentication = async (): Promise<IAuth> => {
  const user = genNewUser()
  const authentication = await authServices.signIn(user)

  return authentication
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
    await toolServices.insert(genNewTool())
  }
}

const truncateTable = async (): Promise<void> => {
  await toolModel.remove({})
}

afterEach(async () => {
  await truncateTable()
})

describe('Test the tool router', () => {
  it('should receive all the tools from the Database', async () => {
    const { token } = await getValidAuthentication()

    await populateBank()
    const { body } = await supertest(app.app)
      .get('/jwt/tools')
      .set({ authorization: token })

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

  it('should receive a tool from the database with the respective ID', async () => {
    const { token } = await getValidAuthentication()
    const tool = genNewTool()

    const { body } = await supertest(app.app)
      .post('/jwt/tools')
      .send(tool)
      .set({ authorization: token })

    const { _id } = body

    const requestedUser = await (
      await supertest(app.app)
        .get(`/jwt/tools/${_id}`)
        .set({ authorization: token })
    ).body

    expect(requestedUser._id).toBe(body._id)
    expect(requestedUser.name).toBe(body.name)
    expect(requestedUser.link).toBe(body.link)
  })
  it('should update a tool from the database with the respective ID', async () => {
    const { token } = await getValidAuthentication()
    const tool = genNewTool()

    const { body } = await supertest(app.app)
      .post('/jwt/tools')
      .send(tool)
      .set({ authorization: token })

    const updateToolResponse = await supertest(app.app)
      .put('/jwt/tools')
      .send({
        ...body,
        title: 'node rocks'
      })
      .set({ authorization: token })

    const updateToolBody = updateToolResponse.body

    expect(updateToolBody.title).toBe('node rocks')
    expect(updateToolBody.link).toBe(body.link)
    expect(updateToolBody.tags).toBeInstanceOf(Array)
  })
  it('should delete a tool from the database with the respective ID', async () => {
    const { token } = await getValidAuthentication()
    const tool = genNewTool()

    const { body } = await supertest(app.app)
      .post('/jwt/tools')
      .send(tool)
      .set({ authorization: token })

    const deletedTool = await supertest(app.app)
      .delete(`/jwt/tools/${body._id}`)
      .set({ authorization: token })

    const tools = await toolServices.getAll()

    expect(deletedTool.status).toBe(204)
    expect(tools.length).toBe(0)
  })

  it('should create a tool', async () => {
    const tool = genNewTool()
    const { token } = await getValidAuthentication()
    const { body } = await supertest(app.app)
      .post('/jwt/tools')
      .send(tool)
      .set({ authorization: token })

    expect(body._id).not.toBeNull()
    expect(body.__v).not.toBeNull()

    expect(body.title).toBe(tool.title)
    expect(body.description).toBe(tool.description)
  })
})
