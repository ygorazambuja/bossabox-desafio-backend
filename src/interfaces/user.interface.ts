import { Document } from 'mongoose'

export interface IUserDocument extends Document {
  username: string
  password: string
  name: string
  email: string
}

export interface IUser {
  username: string
  password: string
  name: string
  email: string
}
