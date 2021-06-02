import request from 'supertest'
import { Connection } from 'typeorm'

import { app } from '../app'
import { getDBConnection } from '../helpers/connection_manager'

let connection: Connection

describe('Authentication Tests', () => {
  beforeAll(async () => {
    connection = await getDBConnection()
  })

  beforeEach(async () => {
    await connection.synchronize(true)
  })

  describe('POST /login', () => {
    beforeEach(async () => {
      await request(app).post('/contratante').send({
        email: 'bethesda@zenimax.com',
        cnpj: '11101987654321',
        company_name: 'Bethesda Softworks',
        trade_name: 'Bethesda',
        password: 'password'
      })
    })

    it('should log in successfully, given the right credentials', async () => {
      const login = await request(app).post('/login').send({
        email: 'bethesda@zenimax.com',
        password: 'password'
      })

      expect(login.status).toBe(200)
    })

    it('should not log in if the username is incorrect', async () => {
      const login = await request(app).post('/login').send({
        email: 'betesda@zenimax.com',
        password: 'password'
      })

      expect(login.status).toBe(403)
    })

    it('should not log in if the password is incorrect', async () => {
      const login = await request(app).post('/login').send({
        email: 'bethesda@zenimax.com',
        password: 'passcode'
      })

      expect(login.status).toBe(403)
    })
  })

  afterAll(async () => {
    await connection.close()
  })
})
