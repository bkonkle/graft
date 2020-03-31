import gql from 'graphql-tag'

import {execute} from '../GraphileUtils'
import TestFixtures from '../../../test/TestFixtures'

jest.mock('debug', () => () => jest.fn())

const Document = gql`
  query allPeople($condition: PerseonCondition!) {
    allPeople(condition: $condition) {
      nodes {
        id
      }
    }
  }
`

describe('utils/GraphileUtils', () => {
  describe('execute()', () => {
    it('executes GraphQL requests', async () => {
      const request = TestFixtures.createRequest()

      const {graphql} = request

      const data = {
        allPeople: {
          nodes: [{id: 'test@email.com'}],
        },
      }

      const graphQlExecute = graphql.execute as jest.Mock
      graphQlExecute.mockResolvedValue({
        data,
      })

      const variables = {condition: {email: 'test@email.com'}}

      const result = await execute(request, {
        node: Document,
        variables,
      })

      expect(result).toEqual(data)
      expect(graphQlExecute).toHaveBeenCalledWith(
        request.resolveInfo.schema,
        Document,
        undefined,
        request.context,
        variables
      )
    })

    it('rejects with errors', async () => {
      const request = TestFixtures.createRequest()
      const {graphql} = request
      const error = 'Test Error'

      const graphQlExecute = graphql.execute as jest.Mock
      graphQlExecute.mockResolvedValue({
        data: null,
        errors: [error],
      })

      const variables = {condition: {email: 'test@email.com'}}

      const promise = execute(request, {
        node: Document,
        variables,
      })

      expect(promise).rejects.toThrowError('GraphQL execute error')
      expect(graphQlExecute).toHaveBeenCalledWith(
        request.resolveInfo.schema,
        Document,
        undefined,
        request.context,
        variables
      )
    })
  })
})
