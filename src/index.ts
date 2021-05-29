import express from 'express'
import 'reflect-metadata'
import { contractorDAO } from './controller/contractorDAO'
import { selective_processDAO } from './controller/selective_processDAO'
import { Contractor } from './models/contractor'
import { genUserToken, authMiddleware, unauthorized } from './helpers/authentication'
import { Selective_Process } from './models/selective_process'
import { PasswordHandler } from './helpers/password_handler'
import cors from 'cors'

export const app = express()

app.use(express.json())
app.use(cors())
const connection = new contractorDAO()
const connection_process = new selective_processDAO()

app.post('/contratante', async (request, response) => {
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
    company_name: contractor.company_name,
    trade_name: contractor.trade_name,
    authorization: genUserToken({ id: contractor.id })
  }

  return response.json(json)
})

app.get('/contratante', async (request, response) => {
  const { email } = request.query

  if (typeof (email) !== 'string') {
    return response.status(400).json({ 'bad request': 'email is not a string' })
  }

  const contractor = await connection.find_contractor(email)

  if (contractor === undefined) {
    return response.status(404).json({ message: 'contractor not found' })
  }
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

app.get('/contratante/todos', async (request, response) => {
  const contractor = await connection.find_all_contractors()

  return response.json(contractor)
})

app.use('/contratante', authMiddleware)
app.delete('/contratante/:email', async (request, response) => {
  const { email } = request.params

  let contractor = await connection.find_contractor(email)
  if (!contractor) return response.status(404).json({ message: 'Contractor not found' })
  if (contractor.id !== response.locals.session.id) return unauthorized(response)
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

app.use('/contratante', authMiddleware)
app.put('/contratante/:search_email', async (request, response) => {
  const { search_email } = request.params
  let contractor = await connection.find_contractor(search_email)
  if (!contractor) return response.status(404).json({ message: 'Contractor not found' })
  if (contractor.id !== response.locals.session.id) return unauthorized(response)

  const { email, cnpj, company_name, trade_name, password } = request.body

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

app.get('/processo-seletivo/todos', async (request, response) => {
  const process = await connection_process.find_all_selective_processes()

  return response.json(process)
})

app.get('/processo-seletivo', async (request, response) => {
  const { id } = request.query

  const process = await connection_process.find_selective_process_by_id(Number(id))

  if (process === undefined) {
    return response.status(404).json({ message: 'process not found' })
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

app.get('/findProcessByTitle', async (request, response) => {
  const { title } = request.query

  const process = await connection_process.find_selective_process_by_title(String(title))

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

app.get('/processo-seletivo/:id', async (request, response) => {
  const { id } = request.params

  const process = await connection_process.find_selective_process_of_contractor_by_id(Number(id))

  if (process === undefined) {
    return response.json({ message: 'process not found' }) //create test
  }

  for (let i = 0; i < process.length; i++) {
    delete process[i].contractor
  }

  return response.json(process)
})

app.use('/processo-seletivo', authMiddleware)
app.post('/processo-seletivo', async (request, response) => {
  const { title, description, deadline, method_of_contact } = request.body

  const contractorId = response.locals.session.id
  let process = new Selective_Process()
  process = await connection_process.add_selective_process(title, description, deadline, method_of_contact, contractorId)

  if (process === undefined) {
    return response.json({ message: 'process not found' })//create test
  }

  const json = {
    message: 'Foi inserido',
    id: process.id,
    title: process.title,
    description: process.description,
    method_of_contact: process.method_of_contact,
    deadline: process.deadline,
    id_contractor: process.contractor.id
  }
  return response.json(json)
})

app.use('/processo-seletivo', authMiddleware)
app.delete('/processo-seletivo/:id', async (request, response) => {
  const { id } = request.params

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

app.use('/processo-seletivo', authMiddleware)
app.put('/processo-seletivo/:id', async (request, response) => {
  const { id } = request.params
  const { title, description, deadline, method_of_contact } = request.body

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

app.post('/login', async (request, response) => {
  const { email, password } = request.body
  if (!email) return response.status(400).json({ message: 'Email field is missing.' })
  if (!password) return response.status(400).json({ message: 'Password field is missing.' })

  const pw_handler = new PasswordHandler()
  const contractor = await connection.find_contractor(email)
  // TODO: Hash password before comparing it
  if (!contractor || !(await pw_handler.authenticate_contractor(password, contractor.password))) {
    return response.status(403).json({ message: 'Invalid username or password.' })
  }

  return response.json({ authorization: genUserToken({ id: contractor.id }) })
})

export const server = app.listen(3333)
