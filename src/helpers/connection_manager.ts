import { createConnection, getConnection } from 'typeorm'
import 'reflect-metadata'

export async function createDBConnection () {
  await createConnection()
}

export async function getDBConnection () {
  return getConnection()
}
