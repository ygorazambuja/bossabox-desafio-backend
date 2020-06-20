import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import * as faker from 'faker'
import { IUser } from '@interfaces/user.interface'
import userServices from '@services/user.services'
import authServices from '@services/auth.services'
import dotenv from 'dotenv'

let mongoServer: MongoMemoryServer

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000

beforeAll(async () => {
  dotenv.config({
    path: '.env.testing'
  })
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
      if (err !== null) throw err
    }
  )
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
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

describe('should test all authentication steps', () => {
  it('should have a successefull authentication', async () => {
    const user = genNewUser()

    const insertedUser = await userServices.insert(user)
    const response = await authServices.logIn(user.username, user.password)

    expect(response.username).toBe(insertedUser.username)
    expect(response.token).not.toBeNull()
  })

  it('should have a authenticate failed, caused by password incorrect', async () => {
    const user = genNewUser()
    await userServices.insert(user)
    const response = await authServices.logIn(user.username, '123456')

    expect(response.message).toBe('Authentication Failed, Wrong Password')
  })

  it('should have a authentication failed, caused by username inexistent', async () => {
    const user = genNewUser()
    await userServices.insert(user)

    const response = await authServices.logIn(
      'inexistentUsername',
      user.password
    )
    expect(response.message).toBe('Authentication Failed, user not found')
  })

  it('should create an user and authenticate', async () => {
    const user: IUser = genNewUser()
    const response = await authServices.signIn(user)
    expect(response.username).toBe(user.username)
    expect(response.token).not.toBeNull()
  })
})
