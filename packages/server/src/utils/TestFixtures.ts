import {mergeDeepRight as merge} from 'ramda'
import {DeepPartial} from 'ts-essentials'

import {
  ResolveInfo,
  PostGraphileBuild,
  GraphileRequest,
} from './PostGraphileUtils'

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
  return {
    context: createContext(overrides.context),
    resolveInfo: createResolveInfo(overrides.resolveInfo),
    build: createBuildUtils(overrides.build),
  }
}

export default {
  createContext,
  createResolveInfo,
  createBuildUtils,
  createRequest,
}
