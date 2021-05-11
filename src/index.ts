import express from 'express';
import "reflect-metadata";
import { createConnection} from 'typeorm';
import { Handle_connections } from "../src/controller/createConnection"

const app = express();

const connection = new Handle_connections;

app.get('/adiciona', (request, response)=> {

    connection.add_contratante();

    return response.json({message: "Hello World"});

})

app.get('/encontra', (request, response)=> {

    connection.find_contratante();

    return response.json({message: "Hello World"});

})

app.get('/', (request, response)=> {

    return response.json({message: "Hello World"});

})

app.listen(3333);