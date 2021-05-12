import express, { response } from 'express';
import { request } from 'http';
import "reflect-metadata";
import { createConnection} from 'typeorm';
import { contractorDAO } from "./controller/contractorDAO"
import { Contractor } from './models/contractor';

const app = express();

app.use(express.json());

const connection = new contractorDAO;

app.get('/adiciona', async (request, response)=> {

    let email = "teste de remoção";
    let cnpj = "123456789";
    let nome_fantasia = "Vai ser removido";
    let razao_social = "Pode ser removido";
    let senha = "Ninguém sabe";

    let contractor = new Contractor();
    contractor = await connection.add_contractor(email, cnpj, nome_fantasia, razao_social, senha);

    const json = {
        "message": "Foi inserido",
        "id": contractor.id,
        "email": contractor.email,
        "password": contractor.password,
        "cnpj": contractor.cnpj,
        "company name": contractor.company_name,
        "trade name": contractor.password
    }

    return response.json(json);

})

app.get('/encontra', async (request, response)=> {

    let email = "teste de remoção";

    let contractor = await connection.find_contractor(email);

    const json = {
        "message": "Foi encontrado",
        "email": contractor.email,
        "password": contractor.password,
        "cnpj": contractor.cnpj,
        "company name": contractor.company_name,
        "trade name": contractor.password
    }

    return response.json(json);

})

app.get('/encontraTodos', async (request, response)=> {

    let contractor = await connection.find_all_contractors();

    console.log(contractor);

    return response.json({"message": "Print no terminal"})

})

app.get('/remove', async (request, response)=> {

    let email = "teste de remoção";

    let contractor = await connection.find_and_delete_contractor(email);

    console.log(contractor);

    const json = {
        "message": "Foi Removido",
        "email": contractor.email,
        "password": contractor.password,
        "cnpj": contractor.cnpj,
        "company name": contractor.company_name,
        "trade name": contractor.password
    }

    return response.json(json);

})

app.get('/update', async (request, response)=> {
    
    let id = 17;

    let email = "mudei";
    let cnpj = "mudei";
    let nome_fantasia = "mudei";
    let razao_social = "mudei";
    let senha = "mudei";

    let contractor = await connection.update_contractor(id, email, cnpj, nome_fantasia, razao_social, senha)

    const json = {
        "message": "Foi atualizado",
        "email": contractor.email,
        "password": contractor.password,
        "cnpj": contractor.cnpj,
        "company name": contractor.company_name,
        "trade name": contractor.password
    }
    
    response.json(json);
})

app.get('/', (request, response)=> {

    return response.json({message: "Hello World"});

})

app.listen(3333);