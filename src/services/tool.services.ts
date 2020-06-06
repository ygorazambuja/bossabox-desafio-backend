import Tool, { IToolDocument } from '../models/tool.model'
class ToolService {
  async insert (tool): Promise<IToolDocument> {
    return await Tool.create(tool)
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
