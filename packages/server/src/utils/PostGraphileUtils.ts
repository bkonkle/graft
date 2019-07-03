/**
 * GraphQLUtils allows us to query the internal PostGraphile schema from within plugins
 * as if we were a client. It provides the `query` and `mutation` functions.
 */
import Debug from 'debug'
import GraphQL, {DocumentNode, GraphQLResolveInfo} from 'graphql'
import {Build} from 'postgraphile'
import {sql as SQL} from 'graphile-build-pg'
import {Client} from 'pg'
import {GraphileHelpers} from 'graphile-utils/node8plus/fieldHelpers'

/**
 * Context provided by PostGraphile and the SessionMiddleware
 */
export interface PostGraphileContext {
  pgClient: Client
  pgRole: string
}

/**
 * Query tools provided by PostGraphile
 */
export interface PostGraphileBuild {
  graphql: typeof GraphQL
  sql: typeof SQL
}

/**
 * Extend the GraphQLResolveInfo with helpers from PostGraphile.
 */
export type ResolveInfo = GraphQLResolveInfo & {
  graphile: GraphileHelpers<unknown>
}

/**
 * A collection of tools for handling a request. The `Context` type argument is used
 * with `createRequest` below to allow users to extend the context based on what
 * they've added with the `additionalGraphQLContextFromRequest` PostGraphile option.
 */
export interface GraphileRequest<Context = PostGraphileContext> {
  context: Context
  resolveInfo: ResolveInfo
  build: PostGraphileBuild
}

/**
 * Set up a prefixed debug logging handler
 */
const debug = Debug('@graft/server:utils:PostGraphileUtils')

/**
 * Collect the PostGraphile tools together and ensure they are properly typed.
 */
export function createRequest<Context = PostGraphileContext>(
  build: Build,
  context: Context,
  resolveInfo: ResolveInfo
): GraphileRequest<Context> {
  const sql: typeof SQL = build.pgSql
  const graphql: typeof GraphQL = build.graphql

  return {context, resolveInfo, build: {sql, graphql}}
}

/**
 * The low-level interface for executing Queries against PostGraphile's internal schema.
 */
export async function execute<Data, Input, Context = PostGraphileContext>(
  request: GraphileRequest<Context>,
  options: {node: DocumentNode; variables: Input}
) {
  const {build} = request
  const {graphql} = build
  const {node, variables} = options

  if (!graphql) {
    throw new Error('GraphQL interface not found')
  }

  const result = await graphql.execute<Data>(
    request.resolveInfo.schema,
    node,
    undefined,
    request.context,
    variables
  )

  if (result.errors) {
    const error = new Error('GraphQL execute error')

    debug(
      `GraphQL execute errors: ${JSON.stringify(result.errors, undefined, 2)}`
    )

    throw error
  }

  return result.data
}

/**
 * Execute a Query against PostGraphile's internal schema.
 */
export async function query<Data, Input, Context = PostGraphileContext>(
  request: GraphileRequest<Context>,
  options: {query: DocumentNode; variables: Input}
) {
  const {query: node, variables} = options

  return execute<Data, Input, Context>(request, {node, variables})
}

/**
 * Execute a Mutation against PostGraphile's internal schema.
 */
export async function mutation<Data, Input, Context = PostGraphileContext>(
  request: GraphileRequest<Context>,
  options: {mutation: DocumentNode; variables: Input}
) {
  const {mutation: node, variables} = options

  return execute<Data, Input, Context>(request, {node, variables})
}

export default {query, mutation}
