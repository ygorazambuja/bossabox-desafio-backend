import Tool from '@models/tool.model'
import { IToolDocument } from '@interfaces/tool.interface'

class ToolService {
  async insert (tool): Promise<IToolDocument> {
    const newTool = await Tool.create(tool)
    return newTool
  }

  async delete (id: string): Promise<IToolDocument> {
    return await Tool.findOneAndDelete({ _id: id })
  }

  async getAll (): Promise<IToolDocument[]> {
    return await Tool.find()
  }

  async insertMany (tools): Promise<any> {
    return await Tool.insertMany(tools)
  }

  async getById (id: string): Promise<any> {
    return await Tool.findById({ _id: id })
  }

  async update (tool): Promise<any> {
    return await Tool.updateOne({ _id: tool._id }, tool)
  }
}

export default new ToolService()
