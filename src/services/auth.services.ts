import IUser from '../interfaces/user.interface'
import jwt from 'jsonwebtoken'
import userServices from './user.services'
import { compareSync } from 'bcrypt'

class AuthService {
  private generateToken (params = {}): string {
    return jwt.sign({ params }, process.env.SECRET, {
      expiresIn: 86400
    })
  }

  async signIn (user: IUser): Promise<any> {
    const insertedUser = await userServices.insert(user)
    return await this.logIn(insertedUser.username, user.password)
  }

  async logIn (username: string, password: string): Promise<any> {
    try {
      const user = await userServices.getByUsername(username)
      if (user == null) {
        return Error('Authentication Failed, user not found')
      }
      if (await compareSync(password, user.password)) {
        return {
          username: username,
          token: this.generateToken({ id: user._id })
        }
      } else {
        return Error('Authentication Failed, wrong password')
      }
    } catch (error) {
      return new Error(error)
    }
  }
}

export default new AuthService()
