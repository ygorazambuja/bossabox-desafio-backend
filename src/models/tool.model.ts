import mongoose, { Schema } from 'mongoose'
import { IToolDocument } from '@interfaces/tool.interface'

const ToolSchema: Schema = new Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  description: { type: String },
  tags: { type: [String] }
})

export default mongoose.model<IToolDocument>('Tool', ToolSchema)
