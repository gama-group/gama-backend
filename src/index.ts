import express from 'express';
import "reflect-metadata";
import { createConnection} from 'typeorm';
import { Handle_connections } from "../src/controller/createConnection"

const app = express();

const connection = new Handle_connections;

app.get('/adiciona', (request, response)=> {

    let email = "bililálilo";
    let cnpj = "987654321";
    let nome_fantasia = "Testes sem erro algum";
    let razao_social = "Testes com erros poucos";
    let senha = "SegredoSecreto";

    connection.add_contratante(email, cnpj, nome_fantasia, razao_social, senha);

    return response.json({message: "Adicionou no banco de dados"});

})

app.get('/encontra', (request, response)=> {

    let email = "teste@gmail.com";

    //connection.find_contratante(email);
    connection.find_all_contratante();

    return response.json({message: "Lista de contratantes"});

})

app.get('/remove', (request, response)=> {

    let email = "bililálilo";

    connection.find_and_delete_contratante(email);

    return response.json({message: "Removeu"});

})

app.get('/', (request, response)=> {

    return response.json({message: "Hello World"});

})

app.listen(3333);