import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

class App {
  public app: express.Application
  public port: number

  constructor (controllers, port) {
    this.app = express()
    this.port = port
    this.initializeMiddlewares()
    dotenv.config()
    this.mongooseConnect().catch(error => new Error(error))
    this.initializeControllers(controllers)
    this.app.use(cors())
  }

  private initializeMiddlewares (): void {
    this.app.use(express.json())
  }

  private initializeControllers (controllers): void {
    controllers.forEach(controller => {
      this.app.use(controller.router)
    })
  }

  private async mongooseConnect (): Promise<void> {
    await mongoose.connect('mongodb://db/bossabox-backend', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }

  public listen (): void {
    this.app.listen(this.port)
  }
}

export default App
