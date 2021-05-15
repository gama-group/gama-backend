import express, { response } from 'express';
import { request } from 'http';
import "reflect-metadata";
import { createConnection} from 'typeorm';
import { contractorDAO } from "./controller/contractorDAO"
import { selective_processDAO } from "./controller/selective_processDAO"
import { Contractor } from './models/contractor';
import { Selective_Process } from './models/selective_process';

const app = express();

app.use(express.json());

const connection = new contractorDAO;
const connection_process = new selective_processDAO;
app.post('/adiciona', async (request, response)=> {

    const { email, cnpj, company_name, trade_name, password } = request.body;

    console.log( email, cnpj, company_name, trade_name, password);

    let contractor = new Contractor();
    contractor = await connection.add_contractor(email, cnpj, company_name, trade_name, password);

    const json = {
        "message": "Foi inserido",
        "id": contractor.id,
        "email": contractor.email,
        "password": contractor.password,
        "cnpj": contractor.cnpj,
        "company name": contractor.company_name,
        "trade name": contractor.trade_name
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

app.put('/update/:search_email', async (request, response)=> {
    
    const { search_email } = request.params;
    const { email, cnpj, company_name, trade_name, password } = request.body;

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

app.post('/addProcess', async(request, response)=> {
    const {title, description, deadline, method_of_contact, id_contractor } = request.body;
    let process = new Selective_Process();
    process = await connection_process.add_selective_process(title, description, deadline, method_of_contact, id_contractor);
    
    const json = {
        "message": "Foi inserido",
        "id": process.id,
        "title": process.title,
        "description": process.description,
        "method of contact": process.method_of_contact,
        "deadline": process.deadline,
        "id contractor": process.id_contractor
    }
    return response.json(json);

})

app.get('/findProcessByTitle', async(request, response) =>{
    const { title } = request.query;
    if(typeof(title) != "string"){
        return response.status(400).json({"bad request": "title is not a string"});
    } 
    let process = await connection_process.find_selective_process_by_title(title);
    const json = {
        "message": "Foi encontrado",
        "id": process.id,
        "title": process.title,
        "description": process.description,
        "method of contact": process.method_of_contact,
        "deadline": process.deadline,
        "id contractor": process.id_contractor
    }
    return response.json(json);

})

app.get('/findProcessById', async(request, response) =>{
    const { id } = request.query;
    if (typeof(id) != "number"){
        return response.status(400).json({"bad request": "id is not a number"});
    }
    let process = await connection_process.find_selective_process_by_id(id);
    const json = {
        "message": "Foi encontrado",
        "id": process.id,
        "title": process.title,
        "description": process.description,
        "method of contact": process.method_of_contact,
        "deadline": process.deadline,
        "id contractor": process.id_contractor
    }
    return response.json(json);

})

app.get('/findAllProcess', async(request, response) =>{
    let process = await connection_process.find_all_selective_processes();
    let json = Object.assign({}, process);

    return response.json(json);

})


app.delete('/removeProcess/:id', async (request, response)=> {

    const { id } = request.params;


    if(typeof(id) != "number"){
        return response.status(400).json({"bad request": "id is not a number"});
    }

    let process = await connection_process.find_and_delete_selective_process_by_id(id);

    const json = {
        "message": "Foi removido",
        "id": process.id,
        "title": process.title,
        "description": process.description,
        "method of contact": process.method_of_contact,
        "deadline": process.deadline,
        "id contractor": process.id_contractor
    }
    
    return response.json(json);

})

app.put('/updateProcess/:id', async (request, response)=>{
    const { id } = request.params;
    const {title, description, deadline, method_of_contact, id_contractor } = request.body;
    if (typeof(id) != "number"){
        return response.status(400).json({"bad request": "id is not a number"});
    }
    let process = await connection_process.update_selective_process(id, title, description, deadline, method_of_contact, id_contractor);
    const json = {
        "message": "Foi atualizado",
        "id": process.id,
        "title": process.title,
        "description": process.description,
        "method of contact": process.method_of_contact,
        "deadline": process.deadline,
        "id contractor": process.id_contractor
    }
    
    return response.json(json);
})


app.get('/', (request, response)=> {

    return response.json({message: "Hello World"});

})

app.listen(3333);