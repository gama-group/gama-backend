import express, { response } from 'express';
import { request } from 'http';
import "reflect-metadata";
import { createConnection} from 'typeorm';
import { contractorDAO } from "./controller/contractorDAO"
import { Contractor } from './models/contractor';
import { genUserToken, retrieveDataFromToken, authMiddleware, unauthorized } from './helpers/authentication'

const app = express();

app.use(express.json());

const connection = new contractorDAO;

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
        "trade name": contractor.trade_name,
        "authorization": genUserToken({ id: contractor.id})
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

app.use('/remove', authMiddleware);
app.delete('/remove/:email', async (request, response) => {

    const { email } = request.params;

    if(typeof(email) != "string"){
        return response.status(400).json({"bad request": "email is not a string"});
    }

    let contractor = await connection.find_contractor(email);
    if (!contractor || contractor.id !== response.locals.session.id) return unauthorized(response);
    contractor = await connection.find_and_delete_contractor(email);

    console.log(contractor);

    const json = {
        "message": "Foi Removido",
        "email": contractor.email,
        "password": contractor.password,
        "cnpj": contractor.cnpj,
        "company name": contractor.company_name,
        "trade name": contractor.password,
    }

    return response.json(json);

})

app.use("/update", authMiddleware);
app.put('/update/:search_email', async (request, response)=> {
    
    const { search_email } = request.params;
    let contractor = await connection.find_contractor(search_email);
    if (!contractor || contractor.id !== response.locals.session.id) return unauthorized(response);

    const { email, cnpj, company_name, trade_name, password } = request.body;

    if(typeof(search_email) != "string"){
        return response.status(400).json({"bad request": "email is not a string"});
    }

    console.log( request.body);
    contractor = await connection.update_contractor(search_email, email, cnpj, company_name, trade_name, password)

    const json = {
        "message": "Foi atualizado",
        "email": contractor.email,
        "password": contractor.password,
        "cnpj": contractor.cnpj,
        "company name": contractor.company_name,
        "trade name": contractor.password
    }

    return response.json(json);
})

app.get('/', (request, response)=> {
    return response.json({message: "Hello World"});

})

app.post('/login', async (request, response) => {
    const { email, password } = request.body;
    if (!email) return response.status(400).json({ message: "Email field is missing." });
    if (!password) return response.status(400).json({ message: "Password field is missing." });

    const contractor = await connection.find_contractor(email);
    // TODO: Hash password before comparing it
    if (!contractor || contractor.password != password) 
    {
        return response.status(403).json({ message: "Invalid username or password."});
    }

    return response.json({ authorization: genUserToken({ id: contractor.id })});
})

app.listen(3333);