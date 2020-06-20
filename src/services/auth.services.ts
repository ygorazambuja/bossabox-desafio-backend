import { IUser } from '@interfaces/user.interface'
import jwt from 'jsonwebtoken'
import userServices from '@services/user.services'
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
    const user = await userServices.getByUsername(username)
    if (user === null) {
      return Error('Authentication Failed, user not found')
    }
    const passwordCompare = await compareSync(password, user.password)

    if (passwordCompare) {
      const token = this.generateToken({ id: user._id })
      return {
        username: username,
        token: token
      }
    } else {
      return Error('Authentication Failed, Wrong Password')
    }
  }
}

export default new AuthService()
