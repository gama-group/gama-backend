import { Contractor } from '../models/contractor'
import { PasswordHandler } from '../helpers/password_handler'
import 'reflect-metadata'
import { getDBConnection } from '../helpers/connection_manager'

export class ContractorDAO {
  async addContractor (email: string, cnpj: string, tradeName: string, companyName: string, password: string):Promise<Contractor> {
    const connection = await getDBConnection()
    const pwHandler = new PasswordHandler()
    let contractor

    try {
      contractor = await connection.getRepository(Contractor)
        .createQueryBuilder('contractor')
        .where('contractor.email = :email', { email })
        .getOne()

      if (!contractor) {
        contractor = new Contractor()
        contractor.email = email
        contractor.cnpj = cnpj
        contractor.tradeName = tradeName
        contractor.companyName = companyName
        contractor.password = await pwHandler.hashNewPassword(password)
        await connection.manager.save(contractor)
      } else contractor = null
    } catch (e) {
      console.log('Unable to add contractor: ', e)
      contractor = null
    }
    return contractor
  }

  async findContractor (id: number):Promise<Contractor> {
    try {
      const connection = await getDBConnection()
      const contractor = await connection
        .getRepository(Contractor)
        .createQueryBuilder('contractor')
        .where('contractor.id = :id', { id: id })
        .getOne()
      return contractor
    } catch (e) {
      console.log('Error: Unable to find contractor.', e)
      return undefined
    }
  }

  async findContractorByEmail (email: string):Promise<Contractor> {
    try {
      const connection = await getDBConnection()
      const contractor = await connection
        .getRepository(Contractor)
        .createQueryBuilder('contractor')
        .where('contractor.email = :email', { email: email })
        .getOne()
      return contractor
    } catch (e) {
      console.log('Error: Unable to find contractor.', e)
      return undefined
    }
  }

  async findContractorById (id: string):Promise<Contractor> {
    try {
      const connection = await getDBConnection()

      const contractor = await connection
        .getRepository(Contractor)
        .createQueryBuilder('contractor')
        .where('contractor.id = :id', { id })
        .getOne()

      return contractor
    } catch (e) {
      console.log('Error: Unable to find contractor.', e)
      return undefined
    }
  }

  async findAllContractors ():Promise<Contractor[]> {
    try {
      const connection = await getDBConnection()

      const contractor = await connection.manager.find(Contractor)
      return contractor
    } catch (e) {
      console.log('Unable to find contractors', e)
      return undefined
    }
  }

  async findAndDeleteContractor (id: number):Promise<Contractor> {
    try {
      const connection = await getDBConnection()

      const contractor = await connection
        .getRepository(Contractor)
        .createQueryBuilder('contractor')
        .where('contractor.id = :id', { id: id })
        .getOne()

      await connection.manager.remove(contractor)

      return contractor
    } catch (e) {
      console.log('Unable to find and delete contractor', e)
      return undefined
    }
  }

  async updateContractor (id: number, email: string, cnpj: string, tradeName: string, companyName: string, password: string):Promise<Contractor> {
    let connection
    try {
      connection = await getDBConnection()
      const contractor = await connection
        .getRepository(Contractor)
        .createQueryBuilder('contractor')
        .where('contractor.id = :id', { id: id })
        .getOne()

      const pwHandler = new PasswordHandler()
      contractor.email = email
      contractor.cnpj = cnpj
      contractor.tradeName = tradeName
      contractor.companyName = companyName
      contractor.password = await pwHandler.updatePassword(contractor.password, password)

      await connection.manager.getRepository(Contractor).save(contractor)
      return contractor
    } catch (e) {
      console.log('Error: Unable to update contractor. ', e)
      return undefined
    }
  }
}
