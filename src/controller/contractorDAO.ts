import { Contractor } from "../models/contractor";
import { SourceMap } from "module";
import "reflect-metadata";
import { Connection, ConnectionManager, createConnection } from "typeorm";
const bcrypt = require('bcrypt');

export class contractorDAO {

    async add_contractor(email: string, cnpj: string, trade_name: string, company_name: string, password: string):Promise<Contractor>{

        try{
            const connection = await createConnection();

            let contractor = new Contractor()

            contractor.email = email;
            contractor.cnpj = cnpj;
            contractor.trade_name = trade_name;
            contractor.company_name = company_name;
            contractor.password = await bcrypt.hash(password, 10);

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
            console.log("error",e);
            return undefined;
        }

    }

    async update_contractor(search_email: string,email: string, cnpj: string, trade_name: string, company_name: string, password: string):Promise<Contractor>{

        try{

            const connection = await createConnection();

            let contractor = await connection
                .getRepository(Contractor)
                .createQueryBuilder("contractor")
                .where("contractor.email = :email", { email: search_email })
                .getOne();

            contractor.email = email;
            contractor.cnpj = cnpj;
            contractor.trade_name = trade_name;
            contractor.company_name = company_name;

            console.log("Senha fornecida: " + password);
            console.log("Senha armazenada: " + contractor.password);

            if(await bcrypt.compare(password, contractor.password)) {
                console.log("Nova senha é igual a senha anterior, e portanto, a senha não foi alterada.");
            } else {
                console.log("E aí, vamo mudar essa senha?");
                contractor.password = await bcrypt.hash(password, 10);
            }

            console.log(contractor);

            await connection.manager.getRepository(Contractor).save(contractor);

            connection.close();

            return contractor;

        }catch(e){
            console.log("error");
            return undefined;
        }

    }
}
