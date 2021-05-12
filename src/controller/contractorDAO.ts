import { SourceMap } from "module";
import "reflect-metadata";
import { Connection, ConnectionManager, createConnection } from "typeorm";
import { Contractor} from "../models/contractor";

export class contractorDAO{

    async add_contractor(email: string, cnpj: string, trade_name: string, company_name: string, password: string):Promise<Contractor>{
        
        try{
            const connection = await createConnection();
            
            let contractor = new Contractor()

            contractor.email = email;
            contractor.cnpj = cnpj;
            contractor.trade_name = trade_name;
            contractor.company_name = company_name;
            contractor.password = password;

            await connection.manager.save(contractor);

            console.log("Contratante foi salvo");
            connection.close();

            return contractor;

        }catch(e){
            console.log("error");
            return undefined;
        }
    }

    async find_contractor(search: string):Promise<Contractor>{
        
        try{

            const connection = await createConnection();

            let contractor = await connection
                .getRepository(Contractor)
                .createQueryBuilder("contractor")
                .where("contractor.email = :email", { email: search })
                .getOne();

            console.log(contractor)
            connection.close();

            return contractor

        }catch(e){
            console.log("error");
            return undefined;
        }
        
    }
    
    async find_all_contractors():Promise<Contractor[]>{
        
        try{
            
            const connection = await createConnection();

            let contractor = await connection.manager.find(Contractor);
            connection.close();

            return contractor;

        }catch(e){
            console.log("error");
            return undefined;
        }

    }

    async find_and_delete_contractor(search: string):Promise<Contractor>{
        
        try{

            const connection = await createConnection();
            

            let contractor = await connection
                .getRepository(Contractor)
                .createQueryBuilder("contractor")
                .where("contractor.email = :email", { email: search })
                .getOne();

            console.log(contractor)
    
            await connection.manager.remove(contractor);
            
            connection.close();

            return contractor;

        }catch(e){
            console.log("error");
            return undefined;
        }

    }

    async update_contractor(key: number,email: string, cnpj: string, trade_name: string, company_name: string, password: string):Promise<Contractor>{

        try{
            
            const connection = await createConnection();

            let contractor = await connection
                .getRepository(Contractor)
                .createQueryBuilder("contractor")
                .where("contractor.id = :id", {id: key})
                .getOne();

            contractor.email = email;
            contractor.cnpj = cnpj;
            contractor.trade_name = trade_name;
            contractor.company_name = company_name;
            contractor.password = password;

            await connection.manager.save(contractor);

            connection.close();
            
            return contractor;

        }catch(e){
            console.log("error");
            return undefined;
        }

    }
}


