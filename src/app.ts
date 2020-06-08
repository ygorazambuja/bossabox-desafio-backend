import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

class App {
  public app: express.Application
  public port: number

  constructor (controllers: any[], port) {
    dotenv.config()

    this.app = express()
    this.port = port

    this.initializeMiddlewares()
    this.mongooseConnect()
    this.initializeControllers(controllers)
    this.app.use(cors())
  }

  private initializeMiddlewares (): any {
    this.app.use(express.json())
  }

  private initializeControllers (controllers): void {
    controllers.forEach(controller => {
      this.app.use(controller.router)
    })
  }

  private mongooseConnect (): any {
    mongoose
      .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      })
      .then(_ => {})
      .catch(err => console.log(err))
  }

  public start (): void {
    this.app.listen(this.port)
  }
}

export default App
