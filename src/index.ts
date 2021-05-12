import express, { response } from 'express';
import { request } from 'http';
import "reflect-metadata";
import { createConnection} from 'typeorm';
import { contractorDAO } from "./controller/contractorDAO"
import { Contractor } from './models/contractor';

const app = express();

app.use(express.json());

const connection = new contractorDAO;

app.post('/adiciona', async (request, response)=> {

    const { email, cnpj, company_name, trade_name, password } = request.body;

    let contractor = new Contractor();
    contractor = await connection.add_contractor(email, cnpj, company_name, trade_name, password);

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

    const { email } = request.query;

    if(typeof(email) != "string"){
        return response.status(400).json({"bad request": "email is not a string"});
    }

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

    let json = Object.assign({}, contractor);
    
    return response.json(json);

})

app.delete('/remove/:email', async (request, response)=> {

    const { email } = request.params;

    console.log(email);

    if(typeof(email) != "string"){
        return response.status(400).json({"bad request": "email is not a string"});
    }

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

app.put('/update', async (request, response)=> {
    
    const { search_email } = request.query;
    const { email, cnpj, company_name, trade_name, password } = request.body;

    console.log(search_email, email, cnpj, company_name, trade_name, password);

    if(typeof(search_email) != "string"){
        return response.status(400).json({"bad request": "email is not a string"});
    }

    let contractor = await connection.update_contractor(search_email, email, cnpj, company_name, trade_name, password)


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