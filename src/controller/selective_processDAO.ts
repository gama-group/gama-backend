import { SourceMap } from 'module'
import 'reflect-metadata'
import { Connection, ConnectionManager, createConnection } from 'typeorm'
import { Contractor } from '../models/contractor'
import { Selective_Process } from '../models/selective_process'

export class selective_processDAO {
  async add_selective_process (title: string, description: string, deadline: string, method_of_contact: string, contractor: Contractor) {
    try {
      const connection = await createConnection()
      const process = new Selective_Process()

      process.title = title
      process.description = description
      process.deadline = deadline
      process.method_of_contact = method_of_contact
      process.contractor = contractor

      await connection.manager.save(process)
      console.log('Selective_Process seletivo salvo')
      connection.close()
      return process
    } catch (e) {
      console.log('error')
      return undefined
    }
  }

  async find_all_selective_processes ():Promise<Selective_Process[]> {
    try {
      const connection = await createConnection()
      const processes = await connection.manager.find(Selective_Process)
      connection.close()
      return processes
    } catch (e) {
      console.log('error')
      return undefined
    }
  }

  async find_selective_process_by_title (search: string):Promise<Selective_Process> {
    try {
      const connection = await createConnection()
      const process = await connection.getRepository(Selective_Process).createQueryBuilder('process').where('process.title = :title', { title: search }).getOne()
      connection.close()
      return process
    } catch (e) {
      console.log('error')
      return undefined
    }
  }

  async find_selective_process_by_id (id: number):Promise<Selective_Process> {
    try {
      const connection = await createConnection()
      const process = await connection.getRepository(Selective_Process).findOne(id)
      connection.close()
      return process
    } catch (e) {
      console.log('error')
      return undefined
    }
  }

  async find_and_delete_selective_process_by_id (id: number):Promise<Selective_Process> {
    try {
      const connection = await createConnection()
      const process = await connection.getRepository(Selective_Process).findOne(id)

      await connection.manager.remove(process)

      connection.close()
      return process
    } catch (e) {
      console.log('error')
      return undefined
    }
  }

  async update_selective_process (search_id: number, title: string, description: string, deadline: string, method_of_contact: string, contractor: Contractor) {
    try {
      const connection = await createConnection()

      const process = await connection.getRepository(Selective_Process).createQueryBuilder('process').where('process.id = :id', { id: search_id }).getOne()

      process.title = title
      process.description = description
      process.deadline = deadline
      process.method_of_contact = method_of_contact
      process.contractor = contractor

      await connection.manager.getRepository(Selective_Process).save(process)
      console.log('Selective_Process seletivo salvo')
      connection.close()
      return process
    } catch (e) {
      console.log('error')
      return undefined
    }
  }
}
