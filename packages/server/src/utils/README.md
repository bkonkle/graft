# Graft Utils

## GraphileUtils

### `query`

Execute a Query against PostGraphile's internal schema. This allows you to use PostGraphile internally and take advantage of GraphQL's expressive syntax for your API business logic.

```ts
import {query} from '@graft/server'

import {
  AllMountainsQuery,
  AllMountainsQueryVariables,
  AllMountainsDocument,
  MountainClasses,
  MountainOrderBy,
} from './Schema.ts'

const fourteeners = await query<AllMountainsQuery, AllMountainsQueryVariables>(
  request,
  {
    query: AllMountainsDocument,
    variables: {
      condition: {
        class: MountainClasses.Fourteener,
      },
      orderBy: MountainOrderBy.NameAsc,
    },
  }
)
```

### `mutation`

Execute a Mutation against PostGraphile's internal schema.

```ts
import {mutation} from '@graft/server'

import {
  UpdateMountainByIdMutation,
  UpdateMountainByIdMutationVariables,
  UpdateMountainByIdDocument,
  UsStates,
} from './Schema.ts'

const result = await mutate<
  UpdateMountainByIdMutation,
  UpdateMountainByIdMutationVariables
>(request, {
  mutation: UpdateMountainByIdDocument,
  variables: {
    input: {
      mountain: {
        state: UsStates.Colorado,
      },
    },
  },
})
```

### `createRequest`

A utility to conveniently package up everything needed by the `query` and `mutation` functions and give everything a clean and easy-to-use type.

```ts
import {createRequest} from '@graft/server'

// ... makeExtendSchemaPlugin
  resolvers: {
    Mutation: {
      markMessagesRead: async (_query, args, context: Context, resolveInfo) => {
        const request = createRequest(context, resolveInfo)

        // ... your operation here
      },
    },
  },
```

## ResolverUtils

### `selectById`

```ts
selectById = async <Context = PostGraphileContext>(
  request: GraphileRequest<Context>,
  tableName: string,
  id: number
): Promise<GraphileData[]>
```

An alias for this:

```ts
graphile.selectGraphQLResultFromTable(
  sql.fragment`table_name`,
  (tableAlias, queryBuilder) => {
    queryBuilder.where(sql.fragment`${tableAlias}.id = ${sql.value(id)}`)
  }
)
```

`GraphileData` is currently just an alias for `{data: any}`, but will likely get more precise over time.

### `selectByIdList`

```ts
selectByIdList = async <Context = PostGraphileContext>(
  request: GraphileRequest<Context>,
  tableName: string,
  ids: number[]
): Promise<GraphileData[]>
```

An alias for this:

```ts
graphile.selectGraphQLResultFromTable(
  sql.fragment`table_name`,
  (tableAlias, queryBuilder) => {
    queryBuilder.where(sql.fragment`${tableAlias}.id = ANY(${sql.value(ids)})`)
  }
)
```

### `runSerial`

```ts
runSerial = async <A>(
  funcs: Array<() => Promise<A>>
): Promise<A[]>
```

Takes an array of thunks (to prevent the Promises from firing before we're ready), and resolves them in sequence rather than concurrently. This prevents the problem of `Promise.all()` causing too many connections.

```ts
const results = await runSerial(
  ids.map(id => () => BugController.getById(request, id))
)
```
