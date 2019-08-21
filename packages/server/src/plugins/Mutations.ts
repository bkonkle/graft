import {Plugin} from 'graphile-build'
import {QueryBuilder} from 'graphile-build-pg'

export const ensureMutationId: Plugin = builder => {
  builder.hook('GraphQLObjectType:fields:field', (field, build, context) => {
    const {pgSql: sql} = build
    const {
      scope: {
        isPgUpdateMutationField,
        isPgCreateMutationField,
        isPgDeleteMutationField,
      },
    } = context
    if (
      !isPgUpdateMutationField &&
      !isPgCreateMutationField &&
      !isPgDeleteMutationField
    ) {
      return field
    }

    context.addArgDataGenerator((_parsedResolveInfoFragment: any) => ({
      pgQuery: (queryBuilder: QueryBuilder) => {
        queryBuilder.select(
          sql.fragment`${queryBuilder.getTableAlias()}.id`,
          '$id'
        )
      },
    }))

    return field
  })
}
