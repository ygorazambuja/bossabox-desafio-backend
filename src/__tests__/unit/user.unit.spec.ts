/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { MongoMemoryServer } from 'mongodb-memory-server'
import userServices from '@services/user.services'
import mongoose from 'mongoose'
import * as faker from 'faker'
import { IUser } from '@interfaces/user.interface'
import { compareSync } from 'bcrypt'

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

const genNewUser = (): IUser => {
  const user: IUser = {
    name: faker.name.firstName(0),
    email: faker.internet.email(),
    password: faker.internet.password(8),
    username: faker.internet.userName()
  }
  return user
}

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('User Unit Testing', () => {
  it('should add a user', async () => {
    const user = genNewUser()

    const response = await userServices.insert(user)

    expect(response.name).toBe(user.name)
    expect(response.email).toBe(user.email)
    expect(response.password).not.toBe(user.password)
    expect(response.username).toBe(user.username)
    expect(response.id).not.toBeNull()
  })

  it('should delete a user', async () => {
    const user = genNewUser()

    const response = await userServices.insert(user)

    const deleteRow = await userServices.delete(response.id)

    expect(deleteRow.name).toBe(user.name)
    expect(deleteRow.password).not.toBe(user.password)
    expect(deleteRow.email).toBe(user.email)
    expect(deleteRow.username).toBe(user.username)
  })

  it('should retrive all users', async () => {
    const users = []

    for (let count = 0; count < 10; count++) {
      users.push(genNewUser())
    }
    await userServices.insertMany(users)

    const response = await userServices.getAll()

    expect(response).toHaveLength(11)
  })

  it('should retrive a user with the specific ID', async () => {
    const user = genNewUser()

    const response = await userServices.insert(user)
    const retriveInsertedUser = await userServices.getById(response.id)

    expect(retriveInsertedUser.name).toBe(user.name)
    expect(retriveInsertedUser.email).toBe(user.email)
    expect(retriveInsertedUser.password).not.toBe(user.password)
    expect(retriveInsertedUser.username).toBe(user.username)
    expect(retriveInsertedUser.id).not.toBeNull()
    expect(retriveInsertedUser.__v).toBe(0)
  })

  it('should update a user', async () => {
    const user = genNewUser()

    const response = await userServices.insert(user)
    await userServices.update({
      _id: response._id,
      name: response.name,
      email: response.email,
      username: 'node',
      password: user.password
    })

    const updatedUser = await userServices.getById(response.id)

    expect(updatedUser.id).toBe(response.id)
    expect(updatedUser.name).toBe(response.name)
    expect(updatedUser.email).toBe(response.email)
    expect(updatedUser.username).toBe('node')
    expect(updatedUser.__v).toBe(0)
  })

  it('should update a password', async () => {
    const user = genNewUser()
    const response = await userServices.insert(user)

    const passwd = faker.internet.password(8)

    await userServices.update({
      _id: response._id,
      name: response.name,
      email: response.email,
      password: passwd
    })

    const updatedUser = await userServices.getById(response.id)

    expect(updatedUser.password).not.toBe(user.password)
    expect(updatedUser.password).not.toBe(passwd)

    expect(compareSync(passwd, updatedUser.password)).toBeTruthy()
  })
})
