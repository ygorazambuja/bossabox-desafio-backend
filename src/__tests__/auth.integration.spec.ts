/* eslint-disable @typescript-eslint/no-unused-vars */
import * as faker from 'faker'
import IUser from '../interfaces/user.interface'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000

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
  it('should do the Sign In', async () => {})

  it('should do the Log In', async () => {})
})
