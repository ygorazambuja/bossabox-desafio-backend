/* eslint-disable @typescript-eslint/restrict-template-expressions */
import App from '../../app'
import supertest from 'supertest'
import * as faker from 'faker'

import ToolController from '../../controllers/tool.controller'
import toolServices from '../../services/tool.services'
import ITool from '../../interfaces/tool.interface'
import toolModel from '../../models/tool.model'
import dotenv from 'dotenv'
import { MongoMemoryServer } from 'mongodb-memory-server'

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
  app = new App([ToolController], 3000)
})

const genNewTool = (): ITool => {
  return {
    title: faker.lorem.word(),
    description: faker.lorem.paragraph(1),
    tags: ['node', 'express', 'todo', 'organization'],
    link: faker.internet.url()
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
    await populateBank()
    const { body } = await supertest(app.app).get('/tools')

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
    const tool = genNewTool()
    const { body } = await supertest(app.app)
      .post('/tools')
      .send(tool)

    const { _id } = body

    const requestedUser = await (await supertest(app.app).get(`/tools/${_id}`))
      .body

    expect(requestedUser._id).toBe(body._id)
    expect(requestedUser.name).toBe(body.name)
    expect(requestedUser.link).toBe(body.link)
  })
  it('should update a tool from the database with the respective ID', async () => {
    const tool = genNewTool()
    const { body } = await supertest(app.app)
      .post('/tools')
      .send(tool)

    const updateToolResponse = await supertest(app.app)
      .put('/tools')
      .send({
        ...body,
        title: 'node rocks'
      })
    const updateToolBody = updateToolResponse.body

    expect(updateToolBody.title).toBe('node rocks')
    expect(updateToolBody.link).toBe(body.link)
    expect(updateToolBody.tags).toBeInstanceOf(Array)
  })
  it('should delete a tool from the database with the respective ID', async () => {
    const tool = genNewTool()

    const insertedTool = await (
      await supertest(app.app)
        .post('/tools')
        .send(tool)
    ).body

    const deletedTool = await supertest(app.app).delete(
      `/tools/${insertedTool._id}`
    )

    const tools = await toolServices.getAll()

    expect(deletedTool.status).toBe(204)
    expect(tools.length).toBe(0)
  })
  it('should create a tool', async () => {
    const user = genNewTool()
    const response = await (
      await supertest(app.app)
        .post('/tools')
        .send(user)
    ).body

    expect(response._id).not.toBeNull()
    expect(response.__v).not.toBeNull()

    expect(response.title).toBe(user.title)
    expect(response.description).toBe(user.description)
  })
})
