import { verify } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

export async function verifyValidToken (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<any> {
  const token = request.headers.authorization
  verify(token, process.env.SECRET, (err, decoded) => {
    if (err !== null) {
      return response.status(401).send({ Error: 'No Authorization' })
    } else next()
  })
}
