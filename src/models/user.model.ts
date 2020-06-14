import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcrypt'

export interface IUserDocument extends Document {
  username: string
  password: string
  name: string
  email: string
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: { type: String, required: true },
    name: { type: String, required: true }
  },
  { timestamps: true }
)

UserSchema.pre<IUserDocument>('save', function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  this.password = bcrypt.hashSync(this.password, 10)
  next()
})

export default mongoose.model<IUserDocument>('User', UserSchema)
