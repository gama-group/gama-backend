import { createConnection } from 'typeorm'
import { app } from '../index'
const request = require('supertest')

describe('POST /contratante', () => {
  beforeEach(async () => {
    const connection = await createConnection()
    await connection.dropDatabase()
    await connection.close()
  })
  it('should add sucessfuly contractor', async () => {
    const response = await request(app).post('/contratante').send({
      email: 'america@company.com',
      cnpj: '12345678910111',
      company_name: 'America',
      trade_name: 'America',
      password: '123'
    })

    expect(response.body).toMatchObject({
      email: 'america@company.com',
      cnpj: '12345678910111',
      'company name': 'America',
      'trade name': 'America'
    })
  })

  it('shouldnt be able to add existing contractor', async () => {
    await request(app).post('/contratante').send({
      email: 'america@company.com',
      cnpj: '12345678910111',
      company_name: 'America',
      trade_name: 'America',
      password: '123'
    })

    const response1 = await request(app).post('/contratante').send({
      email: 'america@company.com',
      cnpj: '12345678910111',
      company_name: 'America',
      trade_name: 'America',
      password: '123'
    })

    expect(response1.body).toMatchObject({
      message: 'Unable to create user.'
    })
  })
})

describe('GET /contratante', () => {
  beforeEach(async () => {
    const connection = await createConnection()
    await connection.dropDatabase()
    await connection.close()
  })

  it('shouldnt find someone', async () => {
    const response = await request(app).get('/contratante?email=america@company.com')
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
      password: '123'
    })
    const response = await request(app).get('/contratante?email=america@company.com')
    expect(response.body).toMatchObject({
      message: 'Foi encontrado'
    })
  })
  it('should fail because missing query', async () => {
    const response = await request(app).get('/contratante')
    expect(response.body).toMatchObject({
      'bad request': 'email is not a string'
    })
  })
})

describe('GET /contratante/todos', () => {
  beforeEach(async () => {
    const connection = await createConnection()
    await connection.dropDatabase()
    await connection.close()
  })
  it('should find everyone', async () => {
    await request(app).post('/contratante').send({
      email: 'america@company.com',
      cnpj: '12345678910111',
      company_name: 'America',
      trade_name: 'America',
      password: '123'
    })
    await request(app).post('/contratante').send({
      email: 'facebook@company.com',
      cnpj: '12345678910111',
      company_name: 'Facebook Corp',
      trade_name: 'Facebook',
      password: '123'
    })
    const response = await request(app).get('/contratante/todos')
    expect(Object.keys(response.body).length).toBe(2)
  })
})

describe('DELETE /contratante/:email', () => {
  beforeEach(async () => {
    const connection = await createConnection()
    await connection.dropDatabase()
    await connection.close()
    await request(app).post('/contratante').send({
      email: 'facebook@company.com',
      cnpj: '12345678910111',
      company_name: 'Facebook Corp',
      trade_name: 'Facebook',
      password: '123'
    })
  })
  it('shouldnt allow removal because unauthorized acess', async () => {
    const response = await request(app).delete('/contratante/america@company.com')

    expect(response.body).toMatchObject({
      message: 'Unauthorized'
    })
  })

  it('shouldnt allow removal because dont exists contractor looked for', async () => {
    const login = await request(app).post('/login').send({
      email: 'facebook@company.com',
      password: '123'
    })

    const response = await request(app).delete('/contratante/america@company.com').set('Authorization', login.body.authorization)
    expect(response.body).toMatchObject({
      message: 'Contractor not found'
    })
  })

  it('shouldnt allow removal because user dont have credentials to remove', async () => {
    const login = await request(app).post('/login').send({
      email: 'facebook@company.com',
      password: '123'
    })
    await request(app).post('/contratante').send({
      email: 'america@company.com',
      cnpj: '12345678910111',
      company_name: 'America',
      trade_name: 'America',
      password: '123'
    })
    await request(app).post('/contratante').send({
      email: 'amazon@company.com',
      cnpj: '12345678910111',
      company_name: 'Amazon Enterprise',
      trade_name: 'AmaZon',
      password: '123'
    })
    const response = await request(app).delete('/contratante/america@company.com').set('Authorization', login.body.authorization)
    expect(response.body).toMatchObject({message: 'Unauthorized'})
  })

  it('should remove successfully', async () => {
    const login = await request(app).post('/login').send({
      email: 'facebook@company.com',
      password: '123'
    })
    await request(app).post('/contratante').send({
      email: 'america@company.com',
      cnpj: '12345678910111',
      company_name: 'America',
      trade_name: 'America',
      password: '123'
    })
    await request(app).post('/contratante').send({
      email: 'amazon@company.com',
      cnpj: '12345678910111',
      company_name: 'Amazon Enterprise',
      trade_name: 'AmaZon',
      password: '123'
    })
    const response = await request(app).delete('/contratante/facebook@company.com').set('Authorization', login.body.authorization)
    expect(response.body).toMatchObject({ message: 'Foi Removido' })
  })
})

describe('PUT /update', () => {
  beforeEach(async () => {
    const connection = await createConnection()
    await connection.dropDatabase()
    await connection.close()
    await request(app).post('/contratante').send({
      email: 'america@company.com',
      cnpj: '12345678910111',
      company_name: 'America',
      trade_name: 'America',
      password: '123'
    })
    await request(app).post('/contratante').send({
      email: 'facebook@company.com',
      cnpj: '12345678910111',
      company_name: 'Facebook Corp',
      trade_name: 'Facebook',
      password: '123'
    })
  })
  it('should update successfully contractor', async () => {
    const login = await request(app).post('/login').send({
      email: 'america@company.com',
      password: '123'
    })

    const response = await request(app).put('/contratante/america@company.com').set('Authorization', login.body.authorization).send({
      email: 'americana@company.com.br',
      cnpj: '12345678900001',
      company_name: 'Americana',
      trade_name: 'Americana Company',
      password: '123abc'
    })

    expect(response.body).toMatchObject({
      message: 'Foi atualizado'
    })
  })

  it('shouldnt update contractor because credentials didnt match', async () => {
    const login = await request(app).post('/login').send({
      email: 'america@company.com',
      password: '123'
    })

    const response = await request(app).put('/contratante/facebook@company.com').set('Authorization', login.body.authorization).send({
      email: 'americana@company.com.br',
      cnpj: '12345678900001',
      company_name: 'Americana',
      trade_name: 'Americana Company',
      password: '123abc'
    })

    expect(response.body).toMatchObject({
      message: 'Unauthorized'
    })
  })

  it('shouldnt update because unauthorized acess', async () => {
    const response = await request(app).put('/contratante/america@company.com').send({
      email: 'americana@company.com.br',
      cnpj: '12345678900001',
      company_name: 'Americana',
      trade_name: 'Americana Company',
      password: '123abc'
    })
    expect(response.body).toMatchObject({
      message: 'Unauthorized'
    })
  })

  it('shouldnt update because contractor wasnt inserted', async () => {
    const login = await request(app).post('/login').send({
      email: 'facebook@company.com',
      password: '123'
    })

    const response = await request(app).put('/contratante/tesla@company.com').set('Authorization', login.body.authorization).send({
      email: 'tesla.motors@company.com.br',
      cnpj: '12345678900001',
      company_name: 'Tesla Motors',
      trade_name: 'Tesla Motors Company',
      password: '123abc'
    })
    expect(response.body).toMatchObject({
      message: 'Contractor not found'
    })
  })
})
