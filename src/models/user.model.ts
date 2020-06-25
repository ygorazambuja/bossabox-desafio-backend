import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import { IUserDocument } from '@interfaces/user.interface'

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
  this.password = bcrypt.hashSync(this.password, 10)
  next()
})

UserSchema.pre('updateOne', async function (next) {
  const docToUpdate = this.getUpdate()
  docToUpdate.password = await bcrypt.hashSync(docToUpdate.password, 10)
})

export default mongoose.model<IUserDocument>('User', UserSchema)
