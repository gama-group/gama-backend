import { SourceMap } from "module";
import "reflect-metadata";
import { Connection, ConnectionManager, createConnection } from "typeorm";
import { Contratante} from "../models/contratante";

export class Handle_connections{

    add_contratante(email: string, cnpj: string, nome_fantasia: string, razao_social: string, senha: string):void{
        createConnection().then(async connection => {

            let contratante = new Contratante()

            contratante.email = email;
            contratante.cnpj = cnpj;
            contratante.nome_fantasia = nome_fantasia;
            contratante.razao_social = razao_social;
            contratante.senha = senha;

            await connection.manager.save(contratante);
            console.log("Contratante foi salvo");
            connection.close();

        }).catch(error => console.log(error));
    }

    find_contratante(search: string):void{
        createConnection().then(async connection => {

            //let contratantes = await connection.manager.find(Contratante);
            let contratantes = await connection
                .getRepository(Contratante)
                .createQueryBuilder("contratante")
                .where("contratante.email = :email", { email: search })
                .getOne();

            console.log(contratantes);
            
            connection.close();
        }).catch(error => console.log(error));
    }
    
    find_all_contratante():void{
        createConnection().then(async connection => {

            let contratantes = await connection.manager.find(Contratante);

            console.log(contratantes);
            
            connection.close();
        }).catch(error => console.log(error));
    }

    find_and_delete_contratante(search: string):void{
        createConnection().then(async connection => {

            let contratante = await connection
                .getRepository(Contratante)
                .createQueryBuilder("contratante")
                .where("contratante.email = :email", { email: search })
                .getOne();

            await connection.manager.remove(contratante);
            
            connection.close();
        }).catch(error => console.log(error));
    }
}


