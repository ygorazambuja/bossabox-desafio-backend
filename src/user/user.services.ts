import User, { IUserDocument } from './user.model'
import IUser from './user.interface'

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
}

export default new UserService()
