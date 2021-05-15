import {SourceMap} from "module";
import "reflect-metadata";
import { Connection, ConnectionManager, createConnection } from "typeorm";
import { Processo} from "../models/selective_process";

export class selective_processDAO{
    async add_selective_process(title: string, description: string, deadline: string, method_of_contact: string, id_contractor: number){

        try{
            const connection = await createConnection();
            let process = new Processo();

            
            process.title = title;
            process.description = description;
            process.deadline = deadline;
            process.method_of_contact = method_of_contact;
            process.id_contractor = id_contractor;

            await connection.manager.save(process);
            console.log("Processo seletivo salvo");
            connection.close()
            return process;
    
        } catch(e){
            console.log("error");
            return undefined;
        }
    }


    async find_all_selective_processes():Promise<Processo[]>{
        try{
            const connection = await createConnection();
            let processes = await connection.manager.find(Processo);
            connection.close();
            return processes;
        } catch(e){
            console.log("error");
            return undefined;
        }
    }

    async find_selective_process_by_title(search: string):Promise<Processo>{
        try{
            const connection = await createConnection();
            let process = await connection.getRepository(Processo).createQueryBuilder("process").where("process.title = :title", {title: search}).getOne();
            connection.close();
            return process;
        }catch(e){
            console.log("error");
            return undefined;
        }
    }

    async find_selective_process_by_id(id: number):Promise<Processo>{
        try{
            const connection = await createConnection();
            let process = await connection.getRepository(Processo).findOne(id);
            connection.close();
            return process;
        }catch(e){
            console.log("error");
            return undefined;
        }
    }

    async find_and_delete_selective_process_by_id(id: number):Promise<Processo>{
        try{
            const connection = await createConnection();
            let process = await connection.getRepository(Processo).findOne(id);

            await connection.manager.remove(process);

            connection.close();
            return process;
        }catch(e){
            console.log("error");
            return undefined;
        }
    }

    async update_selective_process(search_id: number, title: string, description: string, deadline: string, method_of_contact: string, id_contractor: number){

        try{
            const connection = await createConnection();

            let process = await connection.getRepository(Processo).createQueryBuilder("process").where("process.id = :id", {id: search_id}).getOne();

                    
            process.title = title;
            process.description = description;
            process.deadline = deadline;
            process.method_of_contact = method_of_contact;
            process.id_contractor = id_contractor;

            await connection.manager.getRepository(Processo).save(process);
            console.log("Processo seletivo salvo");
            connection.close()
            return process;
    
        } catch(e){
            console.log("error");
            return undefined;
        }
    }

}