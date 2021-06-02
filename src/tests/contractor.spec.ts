import request from 'supertest'
import { Connection } from 'typeorm'

import { app } from '../app'
import { getDBConnection } from '../helpers/connection_manager'

let connection: Connection

describe('Contractor Tests', () => {
  beforeAll(async () => {
    connection = await getDBConnection()
  })

  beforeEach(async () => {
    await connection.synchronize(true)
  })

  describe('POST /contratante', () => {
    it('should add sucessfully contractor', async () => {
      const response = await request(app).post('/contratante').send({
        email: 'america@company.com',
        cnpj: '12345678910111',
        company_name: 'America',
        trade_name: 'America',
        password: 'Cocorico123*'
      })

      expect(response.body).toMatchObject({
        email: 'america@company.com',
        cnpj: '12345678910111',
        company_name: 'America',
        trade_name: 'America'
      })
    })

    it('shouldnt be able to add existing contractor', async () => {
      await request(app).post('/contratante').send({
        email: 'america@company.com',
        cnpj: '12345678910111',
        company_name: 'America',
        trade_name: 'America',
        password: 'Cocorico123*'
      })

      const response1 = await request(app).post('/contratante').send({
        email: 'america@company.com',
        cnpj: '12345678910111',
        company_name: 'America',
        trade_name: 'America',
        password: 'Cocorico123*'
      })

      expect(response1.body).toMatchObject({
        message: 'Unable to create user.'
      })
    })
  })

  describe('GET /contratante', () => {
    it('shouldnt find someone', async () => {
      const response = await request(app).get('/contratante?id=2')
      expect(response.body).toMatchObject({
        message: 'contractor not found'
      })
    })

    it('should find someone', async () => {
      await request(app).post('/contratante').send({
        email: 'america@company.com',
        cnpj: '12345678910111',
        company_name: 'America',
        trade_name: 'America',
        password: 'Cocorico123*'
      })
      const response = await request(app).get('/contratante?id=1')
      expect(response.body).toMatchObject({
        message: 'Foi encontrado'
      })
    })

    it('should fail because celebrate validation failed', async () => {
      const response = await request(app).get('/contratante')
      expect(response.status).toBe(400)
    })
  })

  describe('GET /contratante/todos', () => {
    it('should find everyone', async () => {
      await request(app).post('/contratante').send({
        email: 'america@company.com',
        cnpj: '12345678910111',
        company_name: 'America',
        trade_name: 'America',
        password: 'Cocorico123*'
      })

      await request(app).post('/contratante').send({
        email: 'facebook@company.com',
        cnpj: '12345678910111',
        company_name: 'Facebook Corp',
        trade_name: 'Facebook',
        password: 'Cocorico123*'
      })

      const response = await request(app).get('/contratante/todos')
      expect(Object.keys(response.body).length).toBe(2)
    })
  })

  describe('PUT /contratante/:id', () => {
    beforeEach(async () => {
      await request(app).post('/contratante').send({
        email: 'america@company.com',
        cnpj: '12345678910111',
        company_name: 'America',
        trade_name: 'America',
        password: 'Cocorico123*'
      })

      await request(app).post('/contratante').send({
        email: 'facebook@company.com',
        cnpj: '12345678910111',
        company_name: 'Facebook Corp',
        trade_name: 'Facebook',
        password: 'Cocorico123*'
      })
    })

    it('should update successfully contractor', async () => {
      const login = await request(app).post('/login').send({
        email: 'america@company.com',
        password: 'Cocorico123*'
      })

      const response = await request(app).put('/contratante/1').set('authorization', login.body.authorization).send({
        email: 'americana@company.com.br',
        cnpj: '12345678900001',
        company_name: 'Americana',
        trade_name: 'Americana Company',
        password: '123abcde'
      })

      expect(response.body).toMatchObject({
        message: 'Foi atualizado'
      })
    })

    it('should update successfully contractor with same password', async () => {
      const login = await request(app).post('/login').send({
        email: 'america@company.com',
        password: 'Cocorico123*'
      })

      const response = await request(app).put('/contratante/1').set('authorization', login.body.authorization).send({
        email: 'americana@company.com.br',
        cnpj: '12345678900001',
        company_name: 'Americana',
        trade_name: 'Americana Company',
        password: 'Cocorico123*'
      })

      expect(response.body).toMatchObject({
        message: 'Foi atualizado'
      })
    })

    it('shouldnt update contractor because credentials didnt match', async () => {
      const login = await request(app).post('/login').send({
        email: 'america@company.com',
        password: 'Cocorico123*'
      })

      const response = await request(app).put('/contratante/2').set('authorization', login.body.authorization).send({
        email: 'americana@company.com.br',
        cnpj: '12345678900001',
        company_name: 'Americana',
        trade_name: 'Americana Company',
        password: '123abcde'
      })

      expect(response.body).toMatchObject({
        message: 'Unauthorized'
      })
    })

    it('shouldnt update because unauthorized acess', async () => {
      const response = await request(app).put('/contratante/1').send({
        email: 'americana@company.com.br',
        cnpj: '12345678900001',
        company_name: 'Americana',
        trade_name: 'Americana Company',
        password: '123abcde'
      })
      expect(response.body).toMatchObject({
        message: 'Unauthorized'
      })
    })

    it('shouldnt update because contractor wasnt inserted', async () => {
      const login = await request(app).post('/login').send({
        email: 'facebook@company.com',
        password: 'Cocorico123*'
      })

      const response = await request(app).put('/contratante/3').set('authorization', login.body.authorization).send({
        email: 'tesla.motors@company.com.br',
        cnpj: '12345678900001',
        company_name: 'Tesla Motors',
        trade_name: 'Tesla Motors Company',
        password: '123abcde'
      })
      expect(response.body).toMatchObject({
        message: 'Contractor not found'
      })
    })
  })

  describe('DELETE /contratante/:id', () => {
    beforeEach(async () => {
      await request(app).post('/contratante').send({
        email: 'facebook@company.com',
        cnpj: '12345678910111',
        company_name: 'Facebook Corp',
        trade_name: 'Facebook',
        password: 'Cocorico123*'
      })
    })

    it('shouldnt allow removal because unauthorized acess', async () => {
      const response = await request(app).delete('/contratante/1')

      expect(response.body).toMatchObject({
        message: 'Unauthorized'
      })
    })

    it('shouldnt allow removal because dont exists contractor looked for', async () => {
      const login = await request(app).post('/login').send({
        email: 'facebook@company.com',
        password: 'Cocorico123*'
      })

      const response = await request(app).delete('/contratante/2').set('authorization', login.body.authorization)
      expect(response.body).toMatchObject({
        message: 'Contractor not found'
      })
    })

    it('shouldnt allow removal because user dont have credentials to remove', async () => {
      const login = await request(app).post('/login').send({
        email: 'facebook@company.com',
        password: 'Cocorico123*'
      })
      await request(app).post('/contratante').send({
        email: 'america@company.com',
        cnpj: '12345678910111',
        company_name: 'America',
        trade_name: 'America',
        password: 'Cocorico123*'
      })
      await request(app).post('/contratante').send({
        email: 'amazon@company.com',
        cnpj: '12345678910111',
        company_name: 'Amazon Enterprise',
        trade_name: 'AmaZon',
        password: 'Cocorico123*'
      })
      const response = await request(app).delete('/contratante/2').set('authorization', login.body.authorization)
      expect(response.body).toMatchObject({ message: 'Unauthorized' })
    })

    it('should remove successfully', async () => {
      const login = await request(app).post('/login').send({
        email: 'facebook@company.com',
        password: 'Cocorico123*'
      })

      await request(app).post('/contratante').send({
        email: 'america@company.com',
        cnpj: '12345678910111',
        company_name: 'America',
        trade_name: 'America',
        password: 'Cocorico123*'
      })

      await request(app).post('/contratante').send({
        email: 'amazon@company.com',
        cnpj: '12345678910111',
        company_name: 'Amazon Enterprise',
        trade_name: 'AmaZon',
        password: 'Cocorico123*'
      })

      const response = await request(app).delete('/contratante/1').set('authorization', login.body.authorization)
      expect(response.body).toMatchObject({ message: 'Foi Removido' })
    })
  })

  afterAll(async () => {
    await connection.close()
  })
})
