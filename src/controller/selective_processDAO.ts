import { SourceMap } from 'module'
import 'reflect-metadata'
import { Connection, ConnectionManager, createConnection } from 'typeorm'
import { Contractor } from '../models/contractor'
import { SelectiveProcess } from '../models/selective_process'

export class SelectiveProcessDao {
  async addSelectiveProcess (title: string, description: string, deadline: string, methodOfContact: string, contractorId: string) {
    try {
      const connection = await createConnection()
      let process = new SelectiveProcess()

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

      process = await connection.manager.save(process)

      await connection.close()

      return process
    } catch (e) {
      console.log('error')
      return undefined
    }
  }

  async findAllSelectiveProcesses (): Promise<SelectiveProcess[]> {
    try {
      const connection = await createConnection()

      const processes = await connection.manager.find(SelectiveProcess)

      await connection.close()
      return processes
    } catch (e) {
      console.log('error')
      return undefined
    }
  }

  async findSelectiveProcessByTitle (search: string): Promise<SelectiveProcess> {
    try {
      const connection = await createConnection()

      const process = await connection
        .getRepository(SelectiveProcess)
        .createQueryBuilder('process')
        .leftJoinAndSelect('process.contractor', 'contractor')
        .where('process.title = :title', { title: search })
        .getOne()

      await connection.close()

      return process
    } catch (e) {
      console.log('error')
      return undefined
    }
  }

  async findSelectiveProcessById (id: number): Promise<SelectiveProcess> {
    try {
      const connection = await createConnection()

      const process = await connection
        .getRepository(SelectiveProcess)
        .createQueryBuilder('process')
        .leftJoinAndSelect('process.contractor', 'contractor')
        .where('process.id = :id', { id: id })
        .getOne()
      await connection.close()

      return process
    } catch (e) {
      console.log('Unable to find process', e)
      return undefined
    }
  }

  async findSelectiveProcessOfContractorById (id: number): Promise<SelectiveProcess[]> {
    try {
      const connection = await createConnection()

      const process = await connection
        .getRepository(SelectiveProcess)
        .createQueryBuilder('process')
        .leftJoinAndSelect('process.contractor', 'contractor')
        .where('process.contractor.id = :id', { id: id })
        .getMany()

      await connection.close()

      return process
    } catch (e) {
      console.log('error', e)
      return undefined
    }
  }

  async deleteSelectiveProcessById (id: Number):Promise<SelectiveProcess> {
    try {
      const connection = await createConnection()

      const process = await connection
        .getRepository(SelectiveProcess)
        .createQueryBuilder('process')
        .leftJoinAndSelect('process.contractor', 'contractor')
        .where('process.id = :id', { id: id })
        .getOne()

      await connection.manager.remove(process)

      await connection.close()
      return process
    } catch (e) {
      console.log('Unable to find process: ', e)
      return undefined
    }
  }

  async updateSelectiveProcess (searchId: number, title: string, description: string, deadline: string, methodOfContact: string, contractorId: string) {
    try {
      const connection = await createConnection()

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

      await connection.close()
      return process
    } catch (e) {
      console.log('error')
      return undefined
    }
  }
}
