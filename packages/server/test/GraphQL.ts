import {Application} from 'express'
import supertest from 'supertest'

import {Token} from '../src/server/Express'
import {encodeToken} from './Token'

export const handleQuery = (app: Application, token: Token) => async (
  query: string,
  variables?: object,
  options: {warn?: boolean; expect?: number} = {}
) => {
  const {warn = true, expect = 200} = options

  const response = await supertest
    .agent(app)
    .post('/graphql')
    .set('Authorization', `Bearer ${encodeToken(token)}`)
    .send({query, variables})
    .expect(expect)

  if (warn && response.body.errors) {
    console.error(
      new Error(
        response.body.errors
          .map((err: {message: string}) => err.message)
          .join(', ')
      )
    )
  }

  return response.body
}

export const initGraphQL = (app: Application, token: Token) => ({
  query: handleQuery(app, token),
})

export type GraphQL = ReturnType<typeof initGraphQL>
