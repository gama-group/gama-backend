import { SourceMap } from 'module'
import 'reflect-metadata'
import { getDBConnection } from '../helpers/connection_manager'
import { Contractor } from '../models/contractor'
import { Selective_Process } from '../models/selective_process'
const bcrypt = require('bcrypt')

export class selective_processDAO {
  async add_selective_process (title: string, description: string, deadline: string, method_of_contact: string, contractorId: string) {
    try {
      const connection = await getDBConnection()
      const process = new Selective_Process()

      const contractor = await connection
        .getRepository(Contractor)
        .createQueryBuilder('contractor')
        .where('contractor.id=:id', { id: contractorId })
        .getOne()

      process.title = title
      process.description = description
      process.deadline = deadline
      process.method_of_contact = method_of_contact
      process.contractor = contractor

      await connection.manager.save(process)
      return process
    } catch (e) {
      console.log('error')
      return undefined
    }
  }

  async find_all_selective_processes (): Promise<Selective_Process[]> {
    try {
      const connection = await getDBConnection()

      const processes = await connection.manager.find(Selective_Process)
      return processes
    } catch (e) {
      console.log('error')
      return undefined
    }
  }

  async find_selective_process_by_title (search: string): Promise<Selective_Process> {
    try {
      const connection = await getDBConnection()

      const process = await connection
        .getRepository(Selective_Process)
        .createQueryBuilder('process')
        .leftJoinAndSelect('process.contractor', 'contractor')
        .where('process.title = :title', { title: search })
        .getOne()

      return process
    } catch (e) {
      console.log('error')
      return undefined
    }
  }

  async find_selective_process_by_id (id: number): Promise<Selective_Process> {
    try {
      const connection = await getDBConnection()

      const process = await connection
        .getRepository(Selective_Process)
        .createQueryBuilder('process')
        .leftJoinAndSelect('process.contractor', 'contractor')
        .where('process.id = :id', { id: id })
        .getOne()

      return process
    } catch (e) {
      console.log('Unable to find process', e)
      return undefined
    }
  }

  async find_selective_process_of_contractor_by_id(id: number): Promise<Selective_Process[]>{
    try{
      const connection = await getDBConnection()

      const process = await connection
        .getRepository(Selective_Process)
        .createQueryBuilder('process')
        .leftJoinAndSelect('process.contractor', 'contractor')
        .where('process.contractor.id = :id', { id: id })
        .getMany()

      return process
    
    } catch(e){
      console.log('error', e)
      return undefined
    }
  }

  async find_and_delete_selective_process_by_id (id: Number):Promise<Selective_Process> {
    try {
      const connection = await getDBConnection()

      const process = await connection
        .getRepository(Selective_Process)
        .createQueryBuilder('process')
        .leftJoinAndSelect('process.contractor', 'contractor')
        .where('process.id = :id', { id: id })
        .getOne()

      await connection.manager.remove(process)
      return process
    } catch (e) {
      console.log('Unable to find process: ', e)
      return undefined
    }
  }

  async update_selective_process (search_id: number, title: string, description: string, deadline: string, method_of_contact: string, contractorId: string) {
    try {
      const connection = await getDBConnection()

      const process = await connection
        .getRepository(Selective_Process)
        .createQueryBuilder('process')
        .leftJoinAndSelect('process.contractor', 'contractor')
        .where('process.id = :id', { id: search_id })
        .getOne()

      const contractor = await connection
        .getRepository(Contractor)
        .createQueryBuilder('contractor')
        .where('contractor.id=:id', { id: contractorId })
        .getOne()

      process.title = title
      process.description = description
      process.deadline = deadline
      process.method_of_contact = method_of_contact
      process.contractor = contractor

      await connection.manager.getRepository(Selective_Process).save(process)
      return process
    } catch (e) {
      console.log('error')
      return undefined
    }
  }
}
