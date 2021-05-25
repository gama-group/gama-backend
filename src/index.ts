import express from 'express'
import 'reflect-metadata'
import { contractorDAO } from './controller/contractorDAO'
import { selective_processDAO } from './controller/selective_processDAO'
import { Contractor } from './models/contractor'
import { genUserToken, authMiddleware, unauthorized } from './helpers/authentication'
import { Selective_Process } from './models/selective_process'
import * as bcrypt from 'bcrypt'
import cors from 'cors'

export const app = express()

app.use(express.json())
app.use(cors())

const connection = new contractorDAO()
const connection_process = new selective_processDAO()

app.post('/adiciona', async (request, response) => {
  const { email, cnpj, company_name, trade_name, password } = request.body

  console.log(email, cnpj, company_name, trade_name, password)

  let contractor = new Contractor()
  contractor = await connection.add_contractor(email, cnpj, company_name, trade_name, password)

  if (!contractor) return response.status(403).json({ message: 'Unable to create user.' })

  const json = {
    message: 'User created',
    id: contractor.id,
    email: contractor.email,
    password: contractor.password,
    cnpj: contractor.cnpj,
    'company name': contractor.company_name,
    'trade name': contractor.trade_name,
    authorization: genUserToken({ id: contractor.id })
  }

  return response.json(json)
})

app.get('/encontra', async (request, response) => {
  const { email } = request.query

  if (typeof (email) !== 'string') {
    return response.status(400).json({ 'bad request': 'email is not a string' })
  }

  const contractor = await connection.find_contractor(email)

  const json = {
    message: 'Foi encontrado',
    email: contractor.email,
    password: contractor.password,
    cnpj: contractor.cnpj,
    company_name: contractor.company_name,
    trade_name: contractor.trade_name
  }

  return response.json(json)
})

app.get('/encontraTodos', async (request, response) => {
  const contractor = await connection.find_all_contractors()

  const json = Object.assign({}, contractor)

  return response.json(json)
})

app.use('/remove', authMiddleware)
app.delete('/remove/:email', async (request, response) => {
  const { email } = request.params

  if (typeof (email) !== 'string') {
    return response.status(400).json({ 'bad request': 'email is not a string' })
  }

  let contractor = await connection.find_contractor(email)
  if (!contractor || contractor.id !== response.locals.session.id) return unauthorized(response)
  contractor = await connection.find_and_delete_contractor(email)

  const json = {
    message: 'Foi Removido',
    email: contractor.email,
    password: contractor.password,
    cnpj: contractor.cnpj,
    company_name: contractor.company_name,
    trade_name: contractor.password
  }

  return response.json(json)
})

app.use('/update', authMiddleware)
app.put('/update/:search_email', async (request, response) => {
  const { search_email } = request.params
  let contractor = await connection.find_contractor(search_email)
  if (!contractor || contractor.id !== response.locals.session.id) return unauthorized(response)

  const { email, cnpj, company_name, trade_name, password } = request.body

  if (typeof (search_email) !== 'string') {
    return response.status(400).json({ 'bad request': 'email is not a string' })
  }

  contractor = await connection.update_contractor(search_email, email, cnpj, company_name, trade_name, password)

  const json = {
    message: 'Foi atualizado',
    email: contractor.email,
    password: contractor.password,
    cnpj: contractor.cnpj,
    company_name: contractor.company_name,
    trade_name: contractor.trade_name
  }

  return response.json(json)
})

app.use('/addProcess', authMiddleware)
app.post('/addProcess', async (request, response) => {
  const { title, description, deadline, method_of_contact } = request.body

  const contractorId = response.locals.session.id
  let process = new Selective_Process()
  process = await connection_process.add_selective_process(title, description, deadline, method_of_contact, contractorId)

  const json = {
    message: 'Foi inserido',
    id: process.id,
    title: process.title,
    description: process.description,
    'method of contact': process.method_of_contact,
    deadline: process.deadline,
    id_contractor: process.contractor.id
  }
  return response.json(json)
})

app.get('/findProcessByTitle', async (request, response) => {
  const { title } = request.query

  if (typeof (title) !== 'string') {
    return response.status(400).json({ 'bad request': 'title is not a string' })
  }

  const process = await connection_process.find_selective_process_by_title(title)

  if (process === undefined) {
    return response.json({ message: 'process not found' })
  }

  const json = {
    message: 'Foi encontrado',
    id: process.id,
    title: process.title,
    description: process.description,
    method_of_contact: process.method_of_contact,
    deadline: process.deadline,
    id_contractor: process.contractor.id
  }

  return response.json(json)
})

app.get('/findProcessById', async (request, response) => {
  const { id } = request.query

  if (typeof (Number(id)) !== 'number') {
    return response.status(400).json({ 'bad request': 'id is not a number' })
  }

  const process = await connection_process.find_selective_process_by_id(Number(id))

  if (process === undefined) {
    return response.json({ message: 'process not found' })
  }

  const json = {
    message: 'Foi encontrado',
    id: process.id,
    title: process.title,
    description: process.description,
    method_of_contact: process.method_of_contact,
    deadline: process.deadline,
    id_contractor: process.contractor.id
  }
  return response.json(json)
})

app.get('/findAllProcess', async (request, response) => {
  const process = await connection_process.find_all_selective_processes()

  const json = Object.assign({}, process)

  return response.json(json)
})

app.use('/removeProcess', authMiddleware)
app.delete('/removeProcess/:id', async (request, response) => {
  const { id } = request.params

  if (typeof (Number(id)) !== 'number') {
    return response.status(400).json({ 'bad request': 'id is not a number' })
  }

  const contractorId = response.locals.session.id
  const contractor = await connection.find_contractor_by_id(contractorId)
  let process = await connection_process.find_selective_process_by_id(Number(id))
  if (!contractor || process.contractor.id !== contractor.id) return response.status(404).json({ message: 'Invalid contractor.' })

  process = await connection_process.find_and_delete_selective_process_by_id(Number(id))

  const json = {
    message: 'Foi removido',
    id: process.id,
    title: process.title,
    description: process.description,
    method_of_contact: process.method_of_contact,
    deadline: process.deadline,
    id_contractor: process.contractor.id
  }

  return response.json(json)
})

app.use('/updateProcess', authMiddleware)
app.put('/updateProcess/:id', async (request, response) => {
  const { id } = request.params
  const { title, description, deadline, method_of_contact } = request.body

  if (typeof (Number(id)) !== 'number') {
    return response.status(400).json({ 'bad request': 'id is not a number' })
  }

  const contractorId = response.locals.session.id
  const contractor = await connection.find_contractor_by_id(contractorId)
  let process = await connection_process.find_selective_process_by_id(Number(id))
  console.log('Found process', process)

  if (process === undefined) {
    return response.json({ message: 'process not found' })
  }

  if (!contractor || process.contractor.id !== contractor.id) return response.status(404).json({ message: 'Invalid contractor.' })

  process = await connection_process.update_selective_process(Number(id), title, description, deadline, method_of_contact, contractorId)

  const json = {
    message: 'Foi atualizado',
    id: process.id,
    title: process.title,
    description: process.description,
    method_of_contact: process.method_of_contact,
    deadline: process.deadline,
    id_contractor: process.contractor.id
  }

  return response.json(json)
})

app.get('/', (request, response) => {
  return response.json({ message: 'Hello World' })
})

app.post('/login', async (request, response) => {
  const { email, password } = request.body
  if (!email) return response.status(400).json({ message: 'Email field is missing.' })
  if (!password) return response.status(400).json({ message: 'Password field is missing.' })

  const contractor = await connection.find_contractor(email)
  // TODO: Hash password before comparing it
  if (!contractor || !(await bcrypt.compare(password, contractor.password))) {
    return response.status(403).json({ message: 'Invalid username or password.' })
  }

  return response.json({ authorization: genUserToken({ id: contractor.id }) })
})

app.listen(3333)
