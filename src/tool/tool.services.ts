import Tool, { ITool } from '../tool/tool.model'
class ToolService {
  async insert (tool): Promise<ITool> {
    return await Tool.create(tool)
  }

  async delete (id: string): Promise<ITool> {
    return await Tool.findOneAndDelete({ _id: id })
  }

  async getAll (): Promise<ITool[]> {
    return await Tool.find()
  }

  async insertMany (tools): Promise<any> {
    return await Tool.insertMany(tools)
  }

  async getById (id): Promise<any> {
    return await Tool.findById({ _id: id })
  }

  async update (tool): Promise<any> {
    return await Tool.update({ _id: tool._id }, tool)
  }
}

export default new ToolService()
