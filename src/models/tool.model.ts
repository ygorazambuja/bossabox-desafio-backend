import mongoose, { Schema, Document } from 'mongoose'

export interface ITool extends Document {
  title: string
  link: string
  description: string
  tags: string[]
}

const ToolSchema: Schema = new Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  description: { type: String },
  tags: { type: [String] }
})

export default mongoose.model<ITool>('Tool', ToolSchema)
