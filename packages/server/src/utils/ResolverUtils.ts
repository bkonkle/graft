import {PostGraphileContext, GraphileRequest} from './PostGraphileUtils'

export interface GraphileData {
  data: any
}

export const selectById = async <Context = PostGraphileContext>(
  request: GraphileRequest<Context>,
  tableName: string,
  id: number
): Promise<GraphileData[]> => {
  const {sql, graphile} = request

  return graphile.selectGraphQLResultFromTable(
    sql.identifier(tableName),
    (tableAlias, queryBuilder) => {
      queryBuilder.where(sql.fragment`${tableAlias}.id = ${sql.value(id)}`)
    }
  )
}

export const selectByIdList = async <Context = PostGraphileContext>(
  request: GraphileRequest<Context>,
  tableName: string,
  ids: number[]
): Promise<GraphileData[]> => {
  const {sql, graphile} = request

  return graphile.selectGraphQLResultFromTable(
    sql.identifier(tableName),
    (tableAlias, queryBuilder) => {
      queryBuilder.where(
        sql.fragment`${tableAlias}.id = ANY(${sql.value(ids)})`
      )
    }
  )
}

/**
 * Takes an array of thunks (to prevent the Promises from firing before we're ready), and resolves
 * them in sequence rather than concurrently. This prevents the problem of `Promise.all()` causing
 * too many connections.
 */
export const runSerial = async <A>(
  funcs: Array<() => Promise<A>>
): Promise<A[]> =>
  funcs.reduce(
    (promise, func) =>
      promise.then(result => func().then(Array.prototype.concat.bind(result))),
    Promise.resolve([] as A[])
  )

export default {selectById, selectByIdList, runSerial}
