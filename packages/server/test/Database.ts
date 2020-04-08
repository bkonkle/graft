import snake from 'snakecase-keys'
import {pipe, pick, omit} from 'ramda'
import {knex as Knex} from '@graft/knex'

const TABLES = ['users', 'profiles', 'universes', 'universe_moderators']

export const getDb = <Record, Result>(
  config: Knex.Config
): Knex<Record, Result> => Knex(config)

export const dbCleaner = async <Record, Result>(
  db: Knex<Record, Result>,
  tables = TABLES
): Promise<void> => {
  await Promise.all(
    tables.map(table => db.raw(`TRUNCATE TABLE "${table}" CASCADE;`))
  )
}

export const pickDb = <T>(keys: string[], t: T) => pipe(pick(keys), snake)(t)

export const omitDb = <T>(keys: string[], t: T) => pipe(omit(keys), snake)(t)
