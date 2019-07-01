import Debug from 'debug'

import {execute} from '../GraphQLUtils'
import Fixtures from '../Fixtures'
import {AllPeopleDocument} from '../../Schema'

jest.mock('debug', () => {
  const debug = jest.fn()

  return () => debug
})

describe('utils/GraphQLUtils', () => {
  const debug = (Debug('test') as unknown) as jest.Mock

  describe('execute()', () => {
    it('executes GraphQL requests', async () => {
      const request = Fixtures.createRequest()
      const {
        build: {graphql},
        context: {session},
      } = request

      const data = {
        allPeople: {
          nodes: [{id: session.loginId}],
        },
      }

      const graphQlExecute = graphql!.execute as jest.Mock
      graphQlExecute.mockResolvedValue({
        data,
      })

      const variables = {condition: {email: session.loginId}}

      const result = await execute(request, {
        node: AllPeopleDocument,
        variables,
      })

      expect(result).toEqual(data)
      expect(graphQlExecute).toHaveBeenCalledWith(
        request.resolveInfo.schema,
        AllPeopleDocument,
        undefined,
        request.context,
        variables
      )
    })

    it('logs errors', async () => {
      const request = Fixtures.createRequest()
      const {
        build: {graphql},
        context: {session},
      } = request
      const error = 'Test Error'

      const graphQlExecute = graphql!.execute as jest.Mock
      graphQlExecute.mockResolvedValue({
        data: null,
        errors: [error],
      })

      const variables = {condition: {email: session.loginId}}

      const result = await execute(request, {
        node: AllPeopleDocument,
        variables,
      })

      expect(result).toEqual(null)
      expect(graphQlExecute).toHaveBeenCalledWith(
        request.resolveInfo.schema,
        AllPeopleDocument,
        undefined,
        request.context,
        variables
      )

      expect(debug).toHaveBeenCalledTimes(1)

      const call = debug.mock.calls[0]
      const errors = call[1]
      expect(errors).toEqual(JSON.stringify([error], undefined, 2))
    })
  })
})
