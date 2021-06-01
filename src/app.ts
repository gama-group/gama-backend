import express from 'express'
import 'reflect-metadata'
import { ContractorDAO } from './controller/contractorDAO'
import { SelectiveProcessDao } from './controller/selective_processDAO'
import { Contractor } from './models/contractor'
import { genUserToken, authMiddleware, unauthorized } from './helpers/authentication'
import { celebrate, Joi, errors, Segments } from 'celebrate'
import { SelectiveProcess } from './models/selective_process'
import { PasswordHandler } from './helpers/password_handler'
import expressHumps from 'express-humps'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cors())
app.use(expressHumps())

const connection = new ContractorDAO()
const connectionProcess = new SelectiveProcessDao()

app.post('/contratante', celebrate({
      [Segments.BODY]: Joi.object().keys({
        email: Joi.string().max(64).required(),
        cnpj: Joi.string().min(14).max(14).required(),
        companyName: Joi.string().max(128).required(),
        tradeName: Joi.string().max(128).required(),
        password: Joi.string().required()
      }),
  }), async (request, response) => {
  const { email, cnpj, companyName, tradeName, password } = request.body

  let contractor = new Contractor()
  contractor = await connection.addContractor(email, cnpj, companyName, tradeName, password)

  if (!contractor) return response.status(403).json({ message: 'Unable to create user.' })

  const json = {
    message: 'User created',
    id: contractor.id,
    email: contractor.email,
    password: contractor.password,
    cnpj: contractor.cnpj,
    companyName: contractor.companyName,
    tradeName: contractor.tradeName,
    authorization: genUserToken({ id: contractor.id })
  }

  return response.json(json)
})

app.get('/contratante', celebrate({
      [Segments.QUERY]: Joi.object().keys({
        email: Joi.string().max(64).required()
      }),
  }), async (request, response) => {
  const { email } = request.query

  if (typeof (email) !== 'string') {
    return response.status(400).json({ 'bad request': 'email is not a string' })
  }

  const contractor = await connection.findContractor(email)

  if (contractor === undefined) {
    return response.status(404).json({ message: 'contractor not found' })
  }
  const json = {
    message: 'Foi encontrado',
    email: contractor.email,
    password: contractor.password,
    cnpj: contractor.cnpj,
    companyName: contractor.companyName,
    tradeName: contractor.tradeName
  }

  return response.json(json)
})

app.get('/contratante/todos', async (request, response) => {
  const contractor = await connection.findAllContractors()

  return response.json(contractor)
})

app.use('/contratante', authMiddleware)
app.delete('/contratante/:email', celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        email: Joi.string().max(64).required()
      }),
  }), async (request, response) => {
  const { email } = request.params
  let contractor = await connection.findContractor(email)
  if (!contractor) return response.status(404).json({ message: 'Contractor not found' })
  if (contractor.id !== response.locals.session.id) return unauthorized(response)
  contractor = await connection.findAndDeleteContractor(email)

  const json = {
    message: 'Foi Removido',
    email: contractor.email,
    password: contractor.password,
    cnpj: contractor.cnpj,
    companyName: contractor.companyName,
    tradeName: contractor.password
  }

  return response.json(json)
})

app.use('/contratante', authMiddleware)
app.put('/contratante/:searchEmail', celebrate({
      [Segments.BODY]: Joi.object().keys({
        email: Joi.string().max(64).required(),
        cnpj: Joi.string().min(14).max(14).required(),
        companyName: Joi.string().max(128).required(),
        tradeName: Joi.string().max(128).required(),
        password: Joi.string().required()
      }),
      [Segments.PARAMS]: Joi.object().keys({
          searchEmail: Joi.string().max(64).required()
      })
  }), async (request, response) => {
  const { searchEmail } = request.params
  let contractor = await connection.findContractor(searchEmail)
  if (!contractor) return response.status(404).json({ message: 'Contractor not found' })
  if (contractor.id !== response.locals.session.id) return unauthorized(response)

  const { email, cnpj, companyName, tradeName, password } = request.body
  contractor = await connection.updateContractor(searchEmail, email, cnpj, companyName, tradeName, password)

  const json = {
    message: 'Foi atualizado',
    email: contractor.email,
    password: contractor.password,
    cnpj: contractor.cnpj,
    companyName: contractor.companyName,
    tradeName: contractor.tradeName
  }

  return response.json(json)
})

app.get('/processo-seletivo/todos', async (request, response) => {
  const process = await connectionProcess.findAllSelectiveProcesses()

  return response.json(process)
})

app.get('/processo-seletivo', celebrate({
      [Segments.QUERY]: Joi.object().keys({
        id: Joi.number().required()
      }),
  }), async (request, response) => {
  const { id } = request.query
  const process = await connectionProcess.findSelectiveProcessById(Number(id))

  if (process === undefined) {
    return response.status(404).json({ message: 'process not found' })
  }

  const json = {
    message: 'Foi encontrado',
    id: process.id,
    title: process.title,
    description: process.description,
    methodOfContact: process.methodOfContact,
    deadline: process.deadline,
    id_contractor: process.contractor.id
  }
  return response.json(json)
})

app.get('/findProcessByTitle', celebrate({
      [Segments.QUERY]: Joi.object().keys({
        title: Joi.string().max(128).required()
      }),
  }), async (request, response) => {
  const { title } = request.query
  const process = await connectionProcess.findSelectiveProcessByTitle(String(title))

  if (process === undefined) {
    return response.json({ message: 'process not found' })
  }

  const json = {
    message: 'Foi encontrado',
    id: process.id,
    title: process.title,
    description: process.description,
    methodOfContact: process.methodOfContact,
    deadline: process.deadline,
    id_contractor: process.contractor.id
  }

  return response.json(json)
})

app.get('/processo-seletivo/:id', celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required()
      }),
  }), async (request, response) => {
  const { id } = request.params
  const process = await connectionProcess.findSelectiveProcessOfContractorById(Number(id))

  if (process === undefined) {
    return response.json({ message: 'process not found' }) // create test
  }

  for (let i = 0; i < process.length; i++) {
    delete process[i].contractor
  }

  return response.json(process)
})

app.use('/processo-seletivo', authMiddleware)
app.post('/processo-seletivo', celebrate({
      [Segments.BODY]: Joi.object().keys({
        title: Joi.string().max(128).required(),
        description: Joi.string().max(128).required(),
        deadline: Joi.string().required(),
        methodOfContact: Joi.string().max(64).required()
      }),
  }), async (request, response) => {
  const { title, description, deadline, methodOfContact } = request.body

  const contractorId = response.locals.session.id
  let process = new SelectiveProcess()
  process = await connectionProcess.addSelectiveProcess(title, description, deadline, methodOfContact, contractorId)

  if (process === undefined) {
    return response.json({ message: 'process not found' })// create test
  }

  const json = {
    message: 'Foi inserido',
    id: process.id,
    title: process.title,
    description: process.description,
    methodOfContact: process.methodOfContact,
    deadline: process.deadline,
    id_contractor: process.contractor.id
  }
  return response.json(json)
})

app.use('/processo-seletivo', authMiddleware)
app.delete('/processo-seletivo/:id', celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required()
      }),
  }), async (request, response) => {
  const { id } = request.params

  const contractorId = response.locals.session.id
  const contractor = await connection.findContractorById(contractorId)
  let process = await connectionProcess.findSelectiveProcessById(Number(id))
  if (!contractor || process.contractor.id !== contractor.id) return response.status(404).json({ message: 'Invalid contractor.' })

  process = await connectionProcess.deleteSelectiveProcessById(Number(id))

  const json = {
    message: 'Foi removido',
    id: process.id,
    title: process.title,
    description: process.description,
    methodOfContact: process.methodOfContact,
    deadline: process.deadline,
    id_contractor: process.contractor.id
  }

  return response.json(json)
})

app.use('/processo-seletivo', authMiddleware)
app.put('/processo-seletivo/:id', celebrate({
      [Segments.BODY]: Joi.object().keys({
        title: Joi.string().max(128).required(),
        description: Joi.string().max(128).required(),
        deadline: Joi.string().required(),
        methodOfContact: Joi.string().max(64).required()
      }),
      [Segments.PARAMS]: Joi.object().keys({
          id: Joi.number().required()
      })
  }), async (request, response) => {
  const { id } = request.params
  const { title, description, deadline, methodOfContact } = request.body

  const contractorId = response.locals.session.id
  const contractor = await connection.findContractorById(contractorId)
  let process = await connectionProcess.findSelectiveProcessById(Number(id))

  if (process === undefined) {
    return response.json({ message: 'process not found' })
  }

  if (!contractor || process.contractor.id !== contractor.id) return response.status(404).json({ message: 'Invalid contractor.' })

  process = await connectionProcess.updateSelectiveProcess(Number(id), title, description, deadline, methodOfContact, contractorId)

  const json = {
    message: 'Foi atualizado',
    id: process.id,
    title: process.title,
    description: process.description,
    methodOfContact: process.methodOfContact,
    deadline: process.deadline,
    id_contractor: process.contractor.id
  }

  return response.json(json)
})

app.post('/login', celebrate({
      [Segments.BODY]: Joi.object().keys({
        email: Joi.string().max(64).required(),
        password: Joi.string().required()
      }),
  }), async (request, response) => {
  const { email, password } = request.body
  if (!email) return response.status(400).json({ message: 'Email field is missing.' })
  if (!password) return response.status(400).json({ message: 'Password field is missing.' })

  const pwHandler = new PasswordHandler()
  const contractor = await connection.findContractor(email)
  // TODO: Hash password before comparing it
  if (!contractor || !(await pwHandler.authenticateContractor(password, contractor.password))) {
    return response.status(403).json({ message: 'Invalid username or password.' })
  }

  return response.json({ authorization: genUserToken({ id: contractor.id }) })
})

export { app }
