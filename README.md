# gama-backend

## :rocket: Getting started

The existing routes for CRUD operations:

# Contractor's table

# ```/adiciona```  POST method
### Expected:
A string of email, a string of cnpj, a string of company_name, a string of trade_name and a string of password **in this order** in request's body

### Returns:
A json with message confirming insertion and data inserted
```js
{
        "message": "Insertion completed",
        "id": contractor.id,
        "email": contractor.email,
        "password": contractor.password,
        "cnpj": contractor.cnpj,
        "company name": contractor.company_name,
        "trade name": contractor.trade_name
}
```

# ```/encontra```  GET method
### Expected:
An email's string in request's query 

### Returns:
A json with an successful message and requested contractor's data
```js
{
        "message": "Entry found",
        "email": contractor.email,
        "password": contractor.password,
        "cnpj": contractor.cnpj,
        "company name": contractor.company_name,
        "trade name": contractor.trade_name
}
```

# ```/encontraPeloId```  GET method
### Expected:
A number id in request's query 

### Returns:
A json with an successful message and requested contractor's data
```js
{
        "message": "Entry found",
        "id": contractor.id,
        "email": contractor.email,
        "password": contractor.password,
        "cnpj": contractor.cnpj,
        "company name": contractor.company_name,
        "trade name": contractor.trade_name
}
```

# ```/encontraTodos```  GET method
### Expected:
Nothing

### Returns:
A json with all contractor's data in database

# ```/remove/:email```  DELETE method
### Expected:
An email's string in request's params 

### Returns:
A json with an successful message and deleted contractor's data
```js
{
        "message": "Entry removed",
        "email": contractor.email,
        "password": contractor.password,
        "cnpj": contractor.cnpj,
        "company name": contractor.company_name,
        "trade name": contractor.trade_name
}
```

# ```/update/:email```  PUT method
### Expected:
An email's string in request's param
A string of email, a string of cnpj, a string of company_name, a string of trade_name and a string of password **in this order** in request's body 

### Returns:
A json with an successful message and updated contractor's data
```js
{
        "message": "Entry updated",
        "email": contractor.email,
        "password": contractor.password,
        "cnpj": contractor.cnpj,
        "company name": contractor.company_name,
        "trade name": contractor.trade_name
}
```

# Selective_Process's table

# ```/addProcess```  POST method
### Expected:
A string of title, a string of description, a string of method_of_contact, and a number of id_contractor **in this order** in request's body 

### Returns:
A json with message confirming insertion and data inserted
```js
{
        "message": "Entry inserted",
        "id": process.id,
        "title": process.title,
        "description": process.description,
        "method of contact": process.method_of_contact,
        "deadline": process.deadline,
        "id contractor": process.id_contractor
}
```

# ```/findProcessByTitle```  GET method
### Expected:
An title's string in request's query 

### Returns:
A json with an successful message and requested selective_process's data
```js
{
        "message": "Entry found",
        "id": process.id,
        "title": process.title,
        "description": process.description,
        "method of contact": process.method_of_contact,
        "deadline": process.deadline,
        "id contractor": process.id_contractor
}
```

# ```/findProcessById```  GET method
### Expected:
A number id in request's query 

### Returns:
A json with an successful message and requested contractor's data
```js
{
        "message": "Entry found",
        "id": process.id,
        "title": process.title,
        "description": process.description,
        "method of contact": process.method_of_contact,
        "deadline": process.deadline,
        "id contractor": process.id_contractor
}
```

# ```/findAllProcess```  GET method
### Expected:
Nothing

### Returns:
A json with all contractor's data in database

# ```/removeProcess/:id```  DELETE method
### Expected:
An id's number in request's params 

### Returns:
A json with an successful message and deleted contractor's data
```js
{
        "message": "Entry deleted",
        "id": process.id,
        "title": process.title,
        "description": process.description,
        "method of contact": process.method_of_contact,
        "deadline": process.deadline,
        "id contractor": process.id_contractor
}
```

# ```/updateProcess/:id```  PUT method
### Expected:
An id's number in request's param
A string of title, a string of description, a string of method_of_contact, and a number of id_contractor **in this order** in request's body 

### Returns:
A json with an successful message and updated contractor's data
```js
{
        "message": "Entry updated",
        "id": process.id,
        "title": process.title,
        "description": process.description,
        "method of contact": process.method_of_contact,
        "deadline": process.deadline,
        "id contractor": process.id_contractor
}
```
