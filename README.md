# gama-backend

## Getting started

The existing routes in this program are:

## ```/adiciona```  POST method
### Expected:
A string of email, a string of cnpj, a string of company_name, a string of trade_name and a string of password **in this order** in request's body 
### Returns:
A json with message confirming insertion and data inserted

## ```/encontra```  GET method
### Expected:
An email's string in request's query 
### Returns:
A json with an successful message and requested contractor's data

## ```/encontraPeloId```  GET method
### Expected:
A number id in request's query 
### Returns:
A json with an successful message and requested contractor's data

## ```/encontraTodos```  GET method
### Expected:
Nothing
### Returns:
A json with all contractor's data in database

## ```/remove/:email```  DELETE method
### Expected:
An email's string in request's params 
### Returns:
A json with an successful message and deleted contractor's data

## ```/update/:email```  PUT method
### Expected:
An email's string in request's param
A string of email, a string of cnpj, a string of company_name, a string of trade_name and a string of password **in this order** in request's body 
### Returns:
A json with an successful message and updated contractor's data
