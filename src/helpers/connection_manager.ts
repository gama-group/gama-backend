import { createConnection, getConnection } from 'typeorm'
import 'reflect-metadata'

export async function getDBConnection () {
  try {
    return getConnection()
  } catch (e) {
    return await createConnection()
  }
}
