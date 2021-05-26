import * as jwt from 'jsonwebtoken'
import { Request, response, Response } from 'express'
const ACCESS_TOKEN = '12345467890'

interface ITokenUserData {
    id: Number
};

export const genUserToken = (data: ITokenUserData): string => {
  return jwt.sign(data, ACCESS_TOKEN)
}

export const retrieveDataFromToken = (authorization: string): ITokenUserData | null => {
  const token = authorization
  try {
    const data = jwt.verify(token, ACCESS_TOKEN)
    return data as ITokenUserData
  } catch (e) {
    return null
  }
}

export const unauthorized = (res: Response, message: string = 'Unauthorized') => res.status(401).json({ message })
export const authMiddleware = (req: Request<any>, res: Response<any>, next) => {
  const { authorization } = req.headers

  if (!authorization) return unauthorized(res)

  const tokenData = retrieveDataFromToken(authorization)
  if (!tokenData) return unauthorized(res)
  res.locals = {
    ...res.locals,
    session: tokenData
  }

  next()
}
