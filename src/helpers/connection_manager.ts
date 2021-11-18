import { createConnection, getConnection, getConnectionOptions } from 'typeorm'
import 'reflect-metadata'

export async function getDBConnection () {
  try {
    return getConnection()
  } catch (e) {
    const defaultOptions = await getConnectionOptions()

    return createConnection(Object.assign(defaultOptions, {
      database: process.env.NODE_ENV === 'test' ? 'db_test.sqlite' : defaultOptions.database
    }))
  }
}
