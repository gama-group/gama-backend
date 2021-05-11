import { SourceMap } from "module";
import "reflect-metadata";
import { Connection, ConnectionManager, createConnection } from "typeorm";
import { Contratante} from "../models/contratante";

export class Handle_connections{

    add_contratante():void{
        createConnection({
            "type": "sqlite",
            "database": "test",
            "logging": false,
            "entities": [
            Contratante
        ],
            synchronize: true,
        }).then(async connection => {

            let contratante = new Contratante()

            contratante.email = "teste@teste.com";
            contratante.cnpj = "123456789";
            contratante.nome_fantasia = "Testes sem erros";
            contratante.razao_social = "Testes com erros";
            contratante.senha = "Segredo";

            await connection.manager.save(contratante);
            console.log("Contratante foi salvo");

        }).catch(error => console.log(error));
    }

    find_contratante():void{
        createConnection({
            "type": "sqlite",
            "database": "test",
            "logging": false,
            "entities": [
            Contratante
        ],
            synchronize: true,
        }).then(async connection => {

            let contratantes = await connection.manager.find(Contratante);

            console.log(contratantes);

        }).catch(error => console.log(error));
    }    
}


