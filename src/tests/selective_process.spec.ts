import request from 'supertest'
import { Connection } from 'typeorm'

import { app } from '../app'
import { getDBConnection } from '../helpers/connection_manager'

let connection: Connection

describe('Selective Process Tests', () => {
  beforeAll(async () => {
    connection = await getDBConnection()
  })

  beforeEach(async () => {
    await connection.synchronize(true)

    await request(app).post('/contratante').send({
      email: 'test@test.com.br',
      cnpj: '12345678900000',
      company_name: 'Company Name Test',
      trade_name: 'Trade Name Test',
      password: 'Cocorico123*'
    })
  })

  describe('POST /processo-seletivo', () => {
    it('should be able to create a new process', async () => {
      const login = await request(app).post('/login').send({
        email: 'test@test.com.br',
        password: 'Cocorico123*'
      })

      const response = await request(app).post('/processo-seletivo').set('authorization', login.body.authorization).send({
        title: 'title',
        description: 'test',
        deadline: 'test',
        method_of_contact: 'test'
      })

      expect(response.body).toMatchObject({
        message: 'Foi inserido',
        id: 1,
        title: 'title',
        description: 'test',
        method_of_contact: 'test',
        deadline: 'test',
        id_contractor: 1
      })
    })

    it('should not be able to create a new process without authorization', async () => {
      const response = await request(app).post('/processo-seletivo').send({
        title: 'title',
        description: 'test',
        deadline: 'test',
        method_of_contact: 'test'
      })

      expect(response.body).toMatchObject({
        message: 'Unauthorized'
      })
    })
  })

  describe('GET /findProcessByTitle', () => {
    beforeEach(async () => {
      const login = await request(app).post('/login').send({
        email: 'test@test.com.br',
        password: 'Cocorico123*'
      })

      await request(app).post('/processo-seletivo').set('authorization', login.body.authorization).send({
        title: 'title',
        description: 'test',
        deadline: 'test',
        method_of_contact: 'test'
      })
    })

    it('should be able to find a process by title', async () => {
      const response = await request(app).get('/findProcessByTitle').query({
        title: 'title'
      })

      expect(response.body).toMatchObject({
        message: 'Foi encontrado',
        id: 1,
        title: 'title',
        description: 'test',
        method_of_contact: 'test',
        deadline: 'test',
        id_contractor: 1
      })
    })

    it('should not be able to find a process by title if the process does not exist', async () => {
      const response = await request(app).get('/findProcessByTitle').query({
        title: 'title 2'
      })

      expect(response.body).toMatchObject({
        message: 'process not found'
      })
    })
  })

  describe('GET /processo-seletivo/todos', () => {
    it('should be able to find all process', async () => {
      const login = await request(app).post('/login').send({
        email: 'test@test.com.br',
        password: 'Cocorico123*'
      })

      await request(app).post('/processo-seletivo').set('authorization', login.body.authorization).send({
        title: 'title',
        description: 'test',
        deadline: 'test',
        method_of_contact: 'test'
      })

      await request(app).post('/processo-seletivo').set('authorization', login.body.authorization).send({
        title: 'title 2',
        description: 'test',
        deadline: 'test',
        method_of_contact: 'test'
      })

      const response = await request(app).get('/processo-seletivo/todos')

      expect(response.body).toMatchObject({
        0: {
          id: 1,
          title: 'title',
          description: 'test',
          deadline: 'test',
          method_of_contact: 'test'
        },
        1: {
          id: 2,
          title: 'title 2',
          description: 'test',
          deadline: 'test',
          method_of_contact: 'test'
        }
      })
    })

    it('should find any process', async () => {
      const response = await request(app).get('/processo-seletivo/todos')

      expect(response.body).toMatchObject({})
    })
  })

  describe('GET /processo-seletivo', () => {
    beforeEach(async () => {
      const login = await request(app).post('/login').send({
        email: 'test@test.com.br',
        password: 'Cocorico123*'
      })

      await request(app).post('/processo-seletivo').set('authorization', login.body.authorization).send({
        title: 'title',
        description: 'test',
        deadline: 'test',
        method_of_contact: 'test'
      })
    })

    it('should not be able to find a process if the process does not exist', async () => {
      const response = await request(app).get('/processo-seletivo').query({
        id: Number('1234')
      })

      expect(response.body).toMatchObject({
        message: 'process not found'
      })
    })

    it('should be able to find a process', async () => {
      const response = await request(app).get('/processo-seletivo').query({
        id: Number('1')
      })

      expect(response.body).toMatchObject({
        message: 'Foi encontrado'
      })
    })
  })

  describe('GET /processo-seletivo/:id', () => {
    beforeEach(async () => {
      const login = await request(app).post('/login').send({
        email: 'test@test.com.br',
        password: 'Cocorico123*'
      })

      await request(app).post('/processo-seletivo').set('authorization', login.body.authorization).send({
        title: 'title',
        description: 'test',
        deadline: 'test',
        method_of_contact: 'test'
      })

      await request(app).post('/processo-seletivo').set('authorization', login.body.authorization).send({
        title: 'title2',
        description: 'test2',
        deadline: 'test2',
        method_of_contact: 'test2'
      })
    })

    it('should be able to get process by contractor id', async () => {
      const response = await request(app).get('/processo-seletivo/1')

      expect(response.body).toMatchObject(
        {
          0: {
            id: 1,
            title: 'title',
            description: 'test',
            deadline: 'test',
            method_of_contact: 'test'
          },
          1: {
            id: 2,
            title: 'title2',
            description: 'test2',
            deadline: 'test2',
            method_of_contact: 'test2'
          }
        }
      )
    })

    it('should be able to get process by contractor id 2', async () => {
      await request(app).post('/contratante').send({
        email: 'test2@test2.com.br',
        cnpj: '12345678900000',
        company_name: 'Company Name Test2',
        trade_name: 'Trade Name Test2',
        password: 'Cocorico123*'
      })

      const login2 = await request(app).post('/login').send({
        email: 'test2@test2.com.br',
        password: 'Cocorico123*'
      })

      await request(app).post('/processo-seletivo').set('authorization', login2.body.authorization).send({
        title: 'title3',
        description: 'test3',
        deadline: 'test3',
        method_of_contact: 'test3'
      })

      const response = await request(app).get('/processo-seletivo/2')

      expect(response.body).toMatchObject(
        {
          0: {
            id: 3,
            title: 'title3',
            description: 'test3',
            deadline: 'test3',
            method_of_contact: 'test3'
          }
        }
      )
    })

    it('should return a empty list', async () => {
      const response = await request(app).get('/processo-seletivo/:id').query({
        id: 123
      })

      expect(response.body).toMatchObject(
        {}
      )
    })
  })

  describe('PUT /processo-seletivo/:id', () => {
    beforeEach(async () => {
      const login = await request(app).post('/login').send({
        email: 'test@test.com.br',
        password: 'Cocorico123*'
      })

      await request(app).post('/processo-seletivo').set('authorization', login.body.authorization).send({
        title: 'title',
        description: 'test',
        deadline: 'test',
        method_of_contact: 'test'
      })
    })

    it('should be able to update a process', async () => {
      const login = await request(app).post('/login').send({
        email: 'test@test.com.br',
        password: 'Cocorico123*'
      })

      const response = await request(app).put('/processo-seletivo/1').set('authorization', login.body.authorization).send({
        title: 'new title',
        description: 'a',
        deadline: 'deadline',
        method_of_contact: 'a'
      })

      expect(response.body).toMatchObject({
        message: 'Foi atualizado',
        id: 1,
        title: 'new title',
        description: 'a',
        method_of_contact: 'a',
        deadline: 'deadline',
        id_contractor: 1
      })
    })

    it('should not be able to update a process if the process does not exist', async () => {
      const login = await request(app).post('/login').send({
        email: 'test@test.com.br',
        password: 'Cocorico123*'
      })

      const response = await request(app).put('/processo-seletivo/456').set('authorization', login.body.authorization).send({
        title: 'new title',
        description: 's',
        deadline: 'deadline',
        method_of_contact: 'a'
      })

      expect(response.body).toMatchObject({
        message: 'process not found'
      })
    })

    it('should not be able to update a process without authorization', async () => {
      const response = await request(app).put('/processo-seletivo/1').send({
        title: 'new title',
        description: 'b',
        deadline: 'deadline',
        method_of_contact: 'a'
      })

      expect(response.body).toMatchObject({
        message: 'Unauthorized'
      })
    })
  })

  describe('DELETE /processo-seletivo/:id', () => {
    it('should be able to remove a process', async () => {
      const login = await request(app).post('/login').send({
        email: 'test@test.com.br',
        password: 'Cocorico123*'
      })

      await request(app).post('/processo-seletivo').set('authorization', login.body.authorization).send({
        title: 'title',
        description: 'test',
        deadline: 'test',
        method_of_contact: 'test'
      })

      const response = await request(app).delete('/processo-seletivo/1').set('authorization', login.body.authorization)

      expect(response.body).toMatchObject({
        message: 'Foi removido',
        title: 'title',
        description: 'test',
        method_of_contact: 'test',
        deadline: 'test',
        id_contractor: 1
      })
    })

    it('should not be able to remove a process if the process does not exist', async () => {
      const login = await request(app).post('/login').send({
        email: 'test@test.com.br',
        password: 'Cocorico123*'
      })

      const response = await request(app).delete('/processo-seletivo').set('authorization', login.body.authorization).send({
        id: 123
      })

      expect(response.body).toEqual({})
    })

    it('should not be able to remove a process without authorization', async () => {
      const response = await request(app).delete('/processo-seletivo').send({
        id: '1'
      })

      expect(response.body).toMatchObject({
        message: 'Unauthorized'
      })
    })
  })

  afterAll(async () => {
    await connection.close()
  })
})
