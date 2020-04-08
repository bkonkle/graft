/* eslint-disable @typescript-eslint/ban-ts-ignore */
import expressJwt from 'express-jwt'
import faker from 'faker'
import jwt from 'jsonwebtoken'

import {Token} from '../src/server/Express'

const eJwt = (expressJwt as unknown) as jest.Mock<typeof expressJwt>

export const mockJwt = (token: Token) => {
  eJwt.mockImplementation(
    // @ts-ignore
    (): expressJwt.RequestHandler => (req: IncomingMessage, _res, next) => {
      req.user = token

      next()
    }
  )

  return eJwt
}

export const getToken = (): Token => ({
  sub: faker.random.alphaNumeric(10),
  iat: faker.random.number(10),
  aud: ['localhost'],
  iss: faker.random.alphaNumeric(10),
  exp: faker.random.number(10),
  azp: faker.random.alphaNumeric(10),
  scope: faker.random.alphaNumeric(10),
})

export const encodeToken = (token: Token) =>
  jwt.sign(token, 'test-secret', {algorithm: 'HS256'})
