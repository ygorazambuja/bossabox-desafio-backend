import { Request, Response, Router } from 'express'
import Tool from '@models/tool.model'
import { ITool } from '@interfaces/tool.interface'
import toolServices from '@services/tool.services'
import { check } from 'express-validator'
import { verifyValidToken } from '@middlewares/jwtMiddleware'

class ToolJwtController {
  router = Router()

  constructor () {
    this.initializeRoutes()
  }

  initializeRoutes (): void {
    this.router.get('/jwt/tools', verifyValidToken, this.getTools)
    this.router.get('/jwt/tools/:id', verifyValidToken, this.getById)
    this.router.post(
      '/jwt/tools',
      verifyValidToken,
      [check('title').isString(), check('link').isString()],
      this.addTool
    )
    this.router.delete('/jwt/tools/:id', verifyValidToken, this.deleteTool)
    this.router.put(
      '/jwt/tools',
      verifyValidToken,
      [check('_id').isString()],
      this.updateTool
    )
  }

  private async getTools (
    request: Request,
    response: Response
  ): Promise<Response<void>> {
    const tag = request.query.tag as string

    if (!(tag === undefined || tag === null)) {
      try {
        Tool.find({ tags: tag })
          .then(data => response.status(200).send(data))
          .catch(err => console.error(err))
      } catch (error) {
        return response.status(400)
      }
    } else {
      toolServices
        .getAll()
        .then(data => response.status(200).send(data))
        .catch(err => response.status(400).send(err))
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

    const tool = await toolServices.getById(id)
    await toolServices.delete(tool.id)

    return response.status(204).send()
  }

  private async getById (
    request: Request,
    response: Response
  ): Promise<Response<void>> {
    const { id } = request.params

    try {
      const tool = await toolServices.getById(id)
      return response.status(200).send(tool)
    } catch (error) {
      return response.status(500).send(error)
    }
  }

  private async updateTool (
    request: Request,
    response: Response
  ): Promise<Response<void>> {
    const status = await toolServices.update(request.body)
    const { _id } = request.body
    try {
      if (status.nModified === 1) {
        const tool = await toolServices.getById(_id)
        return response.status(200).send(tool)
      }
    } catch (error) {
      return response.status(500).send(error)
    }
  }
}

export default new ToolJwtController()
