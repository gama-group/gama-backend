import { createConnection } from 'typeorm'
import { app } from '../index'
const request = require('supertest')

describe('POST /adiciona', () => {
  beforeEach(async () => {
    const connection = await createConnection()
    await connection.dropDatabase()
    await connection.close()
  })
  it('add sucessfuly contractor', async () => {
    const response = await request(app).post('/adiciona').send({
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

  it('add existing contractor', async () => {
    await request(app).post('/adiciona').send({
      email: 'america@company.com',
      cnpj: '12345678910111',
      company_name: 'America',
      trade_name: 'America',
      password: '123'
    })

    const response1 = await request(app).post('/adiciona').send({
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

describe('GET /encontra', () => {
  beforeEach(async () =>{
    const connection = await createConnection()
    await connection.dropDatabase()
    await connection.close()
  })

  it('dont find someone', async () => {
    const response = await request(app).get('/encontra?email=america@company.com')
    expect(response.body).toMatchObject({
      message: 'contractor not found'
    })
  })

  it('find someone', async () =>{
    await request(app).post('/adiciona').send({
      email: 'america@company.com',
      cnpj: '12345678910111',
      company_name: 'America',
      trade_name: 'America',
      password: '123'
    })
    const response = await request(app).get('/encontra?email=america@company.com')
    expect(response.body).toMatchObject({
      message: 'Foi encontrado'
    })
  })
  it('dont pass email', async () =>{
    const response = await request(app).get('/encontra')
    expect(response.body).toMatchObject({
      'bad request': 'email is not a string'
    })
  })
})

describe('GET ALL /encontraTodos', () => {
  it('find everyone', async () => {
    await request(app).post('/adiciona').send({
      email: 'america@company.com',
      cnpj: '12345678910111',
      company_name: 'America',
      trade_name: 'America',
      password: '123'
    })
    await request(app).post('/adiciona').send({
      email: 'facebook@company.com',
      cnpj: '12345678910111',
      company_name: 'Facebook Corp',
      trade_name: 'Facebook',
      password: '123'
    })
    const response = await request(app).get('/encontraTodos')
    expect(Object.keys(response.body).length).toBe(2)
  })
})

describe('DELETE /remove/:email', () => {
  it('remove contractor sucessfuly', async () => {
    const response = await request(app).delete('/remove').send({
      email: 'america@company.com'
    })

    expect(response.body).toMatchObject({
      message: 'Foi Removido'
    })
  })
})
