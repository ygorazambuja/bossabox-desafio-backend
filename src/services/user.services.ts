import User, { IUserDocument } from '../models/user.model'
import IUser from '../interfaces/user.interface'

class UserService {
  async insert (user: IUser): Promise<IUserDocument> {
    return await User.create(user)
  }

  /**
   *
   * @param id
   * @returns deleted User<IUserDocument>
   */
  async delete (id: string): Promise<IUserDocument> {
    return await User.findOneAndDelete({ _id: id })
  }

  async getAll (): Promise<IUserDocument[]> {
    return await User.find()
  }

  async insertMany (tools): Promise<any> {
    return await User.insertMany(tools)
  }

  async getById (id: string): Promise<IUserDocument> {
    return await User.findById({ _id: id })
  }

  async update (user): Promise<any> {
    return await User.updateOne({ _id: user._id }, user)
  }

  async getByUsername (username): Promise<IUserDocument> {
    return await User.findOne({ username }).select('+password')
  }
}

export default new UserService()
