import 'reflect-metadata'
import { getDBConnection } from '../helpers/connection_manager'
import { Contractor } from '../models/contractor'
import { SelectiveProcess } from '../models/selective_process'

export class SelectiveProcessDao {
  async addSelectiveProcess (title: string, description: string, deadline: string, methodOfContact: string, contractorId: string) {
    try {
      const connection = await getDBConnection()
      const process = new SelectiveProcess()

      const contractor = await connection
        .getRepository(Contractor)
        .createQueryBuilder('contractor')
        .where('contractor.id=:id', { id: contractorId })
        .getOne()

      process.title = title
      process.description = description
      process.deadline = deadline
      process.methodOfContact = methodOfContact
      process.contractor = contractor

      await connection.manager.save(process)
      return process
    } catch (e) {
      console.log('Unable to add selective process', e)
      return undefined
    }
  }

  async findAllSelectiveProcesses (): Promise<SelectiveProcess[]> {
    try {
      const connection = await getDBConnection()
      const processes = await connection.manager.find(SelectiveProcess)

      return processes
    } catch (e) {
      console.log('Unable to find all selective processes', e)
      return undefined
    }
  }

  async findSelectiveProcessByTitle (search: string): Promise<SelectiveProcess> {
    try {
      const connection = await getDBConnection()

      const process = await connection
        .getRepository(SelectiveProcess)
        .createQueryBuilder('process')
        .leftJoinAndSelect('process.contractor', 'contractor')
        .where('process.title = :title', { title: search })
        .getOne()

      return process
    } catch (e) {
      console.log('Unable to find selective process by title', e)
      return undefined
    }
  }

  async findSelectiveProcessById (id: number): Promise<SelectiveProcess> {
    try {
      const connection = await getDBConnection()

      const process = await connection
        .getRepository(SelectiveProcess)
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

  async findSelectiveProcessOfContractorById (id: number): Promise<SelectiveProcess[]> {
    try {
      const connection = await getDBConnection()

      const process = await connection
        .getRepository(SelectiveProcess)
        .createQueryBuilder('process')
        .leftJoinAndSelect('process.contractor', 'contractor')
        .where('process.contractor.id = :id', { id: id })
        .getMany()

      return process
    } catch (e) {
      console.log('Unable to find selective processes of contractor by id', e)
      return undefined
    }
  }

  async deleteSelectiveProcessById (id: Number):Promise<SelectiveProcess> {
    try {
      const connection = await getDBConnection()

      const process = await connection
        .getRepository(SelectiveProcess)
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

  async updateSelectiveProcess (searchId: number, title: string, description: string, deadline: string, methodOfContact: string, contractorId: string) {
    try {
      const connection = await getDBConnection()

      const process = await connection
        .getRepository(SelectiveProcess)
        .createQueryBuilder('process')
        .leftJoinAndSelect('process.contractor', 'contractor')
        .where('process.id = :id', { id: searchId })
        .getOne()

      const contractor = await connection
        .getRepository(Contractor)
        .createQueryBuilder('contractor')
        .where('contractor.id=:id', { id: contractorId })
        .getOne()

      process.title = title
      process.description = description
      process.deadline = deadline
      process.methodOfContact = methodOfContact
      process.contractor = contractor

      await connection.manager.getRepository(SelectiveProcess).save(process)
      return process
    } catch (e) {
      console.log('Unable to update selective process', e)
      return undefined
    }
  }
}
