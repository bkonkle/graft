import {mergeDeepRight as merge} from 'ramda'
import {DeepPartial} from 'ts-essentials'

import {ResolveInfo, PostGraphileBuild, GraphileRequest} from './GraphileUtils'

interface Context {
  pgClient?: any
  pgRole: string
}

export function createContext(overrides: DeepPartial<Context> = {}): Context {
  return {
    // @ts-ignore - mock client
    pgClient: jest.fn(),
    pgRole: 'my_role',
    ...overrides,
  }
}

export function createResolveInfo(
  overrides: DeepPartial<ResolveInfo> = {}
): ResolveInfo {
  return merge<ResolveInfo, DeepPartial<ResolveInfo>>(
    {
      // @ts-ignore - mock client
      schema: {name: 'test-schema'},
      // @ts-ignore - mock client
      graphile: jest.fn(),
    },
    overrides
  )
}

export function createBuildUtils(
  overrides: DeepPartial<PostGraphileBuild> = {}
): PostGraphileBuild {
  return merge<PostGraphileBuild, DeepPartial<PostGraphileBuild>>(
    {
      // @ts-ignore - mock client
      graphql: {
        execute: jest.fn(),
      },
    },
    overrides
  )
}

export function createRequest(
  overrides: DeepPartial<GraphileRequest<Context>> = {}
): GraphileRequest<Context> {
  const resolveInfo = createResolveInfo(overrides.resolveInfo)
  const build = createBuildUtils({
    ...(overrides.sql ? {sql: overrides.sql} : {}),
    ...(overrides.graphql ? {graphql: overrides.graphql} : {}),
  })

  return {
    context: createContext(overrides.context),
    resolveInfo,
    graphile: resolveInfo.graphile!,
    graphql: build.graphql,
    sql: build.sql,
  }
}

export default {
  createContext,
  createResolveInfo,
  createBuildUtils,
  createRequest,
}
