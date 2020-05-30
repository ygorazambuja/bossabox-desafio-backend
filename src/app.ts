import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

class App {
  public app: express.Application
  public port: number

  constructor (controllers, port: number) {
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
    try {
      await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  public listen (): void {
    this.app.listen(this.port)
  }
}

export default App
