import { Contractor } from '../models/contractor'
import { SourceMap } from 'module'
import { PasswordHandler } from '../helpers/password_handler'
import 'reflect-metadata'
import { getDBConnection } from '../helpers/connection_manager'

export class contractorDAO {
  async add_contractor (email: string, cnpj: string, trade_name: string, company_name: string, password: string):Promise<Contractor> {
    const connection = await getDBConnection()
    const pw_handler = new PasswordHandler()
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
        contractor.trade_name = trade_name
        contractor.company_name = company_name
        contractor.password = await pw_handler.hash_new_password(password)
        await connection.manager.save(contractor)
      } else contractor = null
    } catch (e) {
      console.log('error', e)
      contractor = null
    }
    return contractor
  }

  async find_contractor (search: string):Promise<Contractor> {
    try {
      const connection = await getDBConnection()

      const contractor = await connection
        .getRepository(Contractor)
        .createQueryBuilder('contractor')
        .where('contractor.email = :email', { email: search })
        .getOne()
      return contractor
    } catch (e) {
      console.log('Error: Unable to find contractor.', e)
      return undefined
    }
  }

  async find_contractor_by_id (id: string):Promise<Contractor> {
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

  async find_all_contractors ():Promise<Contractor[]> {
    try {
      const connection = await getDBConnection()

      const contractor = await connection.manager.find(Contractor)
      return contractor
    } catch (e) {
      console.log('error')
      return undefined
    }
  }

  async find_and_delete_contractor (search: string):Promise<Contractor> {
    try {
      const connection = await getDBConnection()

      const contractor = await connection
        .getRepository(Contractor)
        .createQueryBuilder('contractor')
        .where('contractor.email = :email', { email: search })
        .getOne()

      await connection.manager.remove(contractor)

      return contractor
    } catch (e) {
      console.log('error', e)
      return undefined
    }
  }

  async update_contractor (search_email: string, email: string, cnpj: string, trade_name: string, company_name: string, password: string):Promise<Contractor> {
    let connection
    try {
      connection = await getDBConnection()
      const contractor = await connection
        .getRepository(Contractor)
        .createQueryBuilder('contractor')
        .where('contractor.email = :email', { email: search_email })
        .getOne()

      const pw_handler = new PasswordHandler()
      contractor.email = email
      contractor.cnpj = cnpj
      contractor.trade_name = trade_name
      contractor.company_name = company_name
      contractor.password = await pw_handler.update_password(contractor.password, password)

      await connection.manager.getRepository(Contractor).save(contractor)
      return contractor
    } catch (e) {
      console.log('Error: Unable to update contractor. ', e)
      await connection.close()
      return undefined
    }
  }
}
