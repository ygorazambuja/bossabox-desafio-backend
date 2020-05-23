import express, { Request, Response } from 'express'
import Tool from './tool.model'
import ITool from './tool.interface'

class ToolController {
  public router = express.Router()

  constructor () {
    this.initializeRoutes()
  }

  initializeRoutes (): void {
    this.router.get('/tools', this.getTools)
    this.router.post('/tools', this.addTool)
    this.router.delete('/tools/:id', this.deleteTool)
  }

  private async getTools (
    request: Request,
    response: Response
  ): Promise<Response<ITool | void>> {
    const tag = request.query.tag as string
    try {
      const tools = await Tool.find({ tags: tag })
      return response.status(200).send(tools)
    } catch (error) {
      return response.status(400)
    }
  }

  private async addTool (
    request: Request,
    response: Response
  ): Promise<Response<ITool>> {
    const tool: ITool = request.body
    const insertedTool = await Tool.create(tool)
    return response.status(201).send(insertedTool)
  }

  private async deleteTool (
    request: Request,
    response: Response
  ): Promise<Response<void>> {
    const { id } = request.params

    const tool = await Tool.findById(id)
    await Tool.deleteOne(tool)

    return response.status(204).send()
  }
}

export default ToolController
