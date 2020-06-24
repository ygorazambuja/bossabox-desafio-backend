import express, { Application } from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'

class App {
  public app: Application
  public port: number

  constructor (controllers: any[], port) {
    dotenv.config({
      path: process.env.NODE_ENV === 'test' ? '.env.testing' : '.env'
    })

    this.app = express()
    this.port = port

    this.initializeMiddlewares()
    this.mongooseConnect()
    this.initializeControllers(controllers)
    this.app.use(cors())
    this.app.use(helmet())
  }

  private initializeMiddlewares (): void {
    this.app.use(express.json())
  }

  private initializeControllers (controllers): void {
    controllers.forEach(controller => {
      this.app.use(controller.router)
    })
  }

  private mongooseConnect (): void {
    mongoose
      .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      })
      .then(_ => {})
      .catch(err => console.error(err))
  }

  public start (): void {
    this.app.listen(this.port)
  }
}

export default App
