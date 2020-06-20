import { Document } from 'mongoose'

export interface ITool {
  title: string
  link: string
  description: string
  tags: string[]
}
export interface IToolDocument extends Document {
  title: string
  link: string
  description: string
  tags: string[]
}
