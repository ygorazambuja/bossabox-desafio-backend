/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { MongoMemoryServer } from 'mongodb-memory-server'
import toolServices from '../../services/tool.services'
import mongoose from 'mongoose'
import * as faker from 'faker'

let mongoServer: MongoMemoryServer

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000

beforeAll(async () => {
  mongoServer = new MongoMemoryServer()
  const mongoUri = await mongoServer.getUri()
  await mongoose.connect(
    mongoUri,
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    err => {
      if (err) throw err
    }
  )
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('User Unit Test', () => {
  it('should add a tool', async () => {
    const tool = {
      title: faker.lorem.word(),
      description: faker.lorem.paragraph(1),
      tags: ['node', 'express', 'todo', 'organization'],
      link: faker.internet.url()
    }

    const response = await toolServices.insert(tool)

    expect(response.title).toBe(tool.title)
    expect(response.description).toBe(tool.description)
    expect(response.tags).toHaveLength(4)
    expect(response.tags).toContain('node')
    expect(response.link).toBe(tool.link)
    expect(response.__v).toBe(0)
    expect(response.id).not.toBeNull()
  })
  it('should delete a tool', async () => {
    const tool = {
      title: faker.lorem.word(),
      description: faker.lorem.paragraph(1),
      tags: ['node', 'express', 'todo', 'organization'],
      link: faker.internet.url()
    }

    const response = await toolServices.insert(tool)

    const deletedRow = await toolServices.delete(response._id)

    expect(deletedRow.title).toBe(tool.title)
    expect(deletedRow.description).toBe(tool.description)
    expect(deletedRow.tags).toHaveLength(4)
    expect(deletedRow.tags).toContain('node')
    expect(deletedRow.link).toBe(tool.link)
    expect(deletedRow.__v).toBe(0)
    expect(deletedRow.id).not.toBeNull()
  })
  it('should retrive all tools', async () => {
    const tools = []
    for (let count = 0; count < 10; count++) {
      tools.push({
        title: faker.lorem.words(1),
        description: faker.lorem.paragraph(1),
        tags: ['node', 'express', 'organization'],
        link: faker.internet.url()
      })
    }

    await toolServices.insertMany(tools)

    const response = await toolServices.getAll()

    expect(response).toHaveLength(11)
  })
  it('should retrive a tool with an specific id', async () => {
    const tool = {
      title: faker.lorem.word(),
      description: faker.lorem.paragraph(1),
      tags: ['node', 'express', 'todo', 'organization'],
      link: faker.internet.url()
    }

    const response = await toolServices.insert(tool)

    const retriveInsertedTool = await toolServices.getById(response._id)

    expect(retriveInsertedTool.title).toBe(tool.title)
    expect(retriveInsertedTool.description).toBe(tool.description)
    expect(retriveInsertedTool.tags).toHaveLength(4)
    expect(retriveInsertedTool.tags).toContain('node')
    expect(retriveInsertedTool.link).toBe(tool.link)
    expect(retriveInsertedTool.__v).toBe(0)
    expect(retriveInsertedTool.id).not.toBeNull()
  })
  it('should update a tool', async () => {
    const tool = {
      title: faker.lorem.word(),
      description: faker.lorem.paragraph(1),
      tags: ['node', 'express', 'todo', 'organization'],
      link: faker.internet.url()
    }

    const response = await toolServices.insert(tool)

    const updateQueryResponse = await toolServices.update({
      _id: response._id,
      description: response.description,
      tags: response.tags,
      link: response.link,
      title: 'node rocks'
    })

    expect(updateQueryResponse.n).toBe(1)
    expect(updateQueryResponse.nModified).toBe(1)

    const updatedTool = await toolServices.getById(response._id)
    expect(updatedTool.title).toBe('node rocks')
    expect(updatedTool.description).toBe(tool.description)
    expect(updatedTool.tags).toHaveLength(4)
    expect(updatedTool.tags).toContain('node')
    expect(updatedTool.link).toBe(tool.link)
    expect(updatedTool.__v).toBe(0)
    expect(updatedTool.id).not.toBeNull()
  })
  it('should receive an error when trying to update a tool with a wrong(but valid) _id', async () => {
    const tool = {
      title: faker.lorem.word(),
      description: faker.lorem.paragraph(1),
      tags: ['node', 'express', 'todo', 'organization'],
      link: faker.internet.url()
    }

    const response = await toolServices.insert(tool)

    const updateQueryResponse = await toolServices.update({
      _id: '5ed7124d92cf81efc6008b25',
      description: response.description,
      tags: response.tags,
      link: response.link,
      title: 'node rocks'
    })

    expect(updateQueryResponse.n).toBe(0)
    expect(updateQueryResponse.nModified).toBe(0)
  })
})
