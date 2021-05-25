# gama-backend

## :rocket: Getting started

The existing routes for CRUD operations:

# Contractor's table

# `/contratante` POST method

Adds a new contractor.

### Expects:

```ts
{
        body: {
                email: string,
                cpf: string,
                company_name: string,
                trade_name: string,
                password: string
        }
}
```

### Returns:

Success:

```js
{
        status: 200,
        body: {
                "message": "Insertion completed",
                "id": contractor.id,
                "email": contractor.email,
                "password": contractor.password,
                "cnpj": contractor.cnpj,
                "company name": contractor.company_name,
                "trade name": contractor.trade_name
        }
}
```

Error: Email has already been used by another contractor, or a server internal error

```ts
{
        status: 403,
        body: {
                message: "Unable to create user."
        }
}
```

# `/contratante/:email` GET method

Retrieves information from a contractor with the specified email.

### Expects:

```ts
{
  query: {
    // The contractor email
    email: string;
  }
}
```

### Returns:

A json with an successful message and requested contractor's data

Success:

```js
{
        status: 200,
        body: {
                "message": "Foi encontrado",
                "email": contractor.email,
                "password": contractor.password,
                "cnpj": contractor.cnpj,
                "company name": contractor.company_name,
                "trade name": contractor.trade_name
        }
}
```

Error: No contractor found with the specified email

```js
{
        status: 404,
        body: {
                message: "Contractor not found"
        }
}
```

Error: Email query parameter not specified

```js
{
       status: 400,
       body: {
               message: "email is not a string"
       }
}
```

# `/encontraPeloId` GET method

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

# `/contratante/todos` GET method

### Expects:

Nothing

### Returns:

A json object with all contractors' data from the database

```ts
{
        status: 200,
        body: {
                0: {
                id: contractor.id,
                email": contractor.email,
                password: contractor.password,
                cnpj: contractor.cnpj,
                company name: contractor.company_name,
                trade name: contractor.trade_name
                },
                1: {
                        ...
                },
                ...
        }
}
```

# `/contratante/:email` DELETE method

## _private_

### Expects:

```ts
{
  header: {
        // The JWT
        authorization: string
  },
  params: {
    //   The contractor email
    email: string;
  }
}
```

### Returns:

A json with an successful message and deleted contractor's data

```js
{
        "message": "Foi removido.",
        "email": contractor.email,
        "password": contractor.password,
        "cnpj": contractor.cnpj,
        "company name": contractor.company_name,
        "trade name": contractor.trade_name
}
```

Error: Email not supplied or email does not belong to any user

```ts
{
        status: 404,
        body: {
                message: "Contractor not found"
        }
}
```

Error: User has not supplied a valid authorization token

```ts
{
        status: 401,
        body: {
                message: "Unauthorized"
        }
}
```

# `/update/:email` PUT method

## **private**

### Expects:

```ts
{
        header: {
                authorization: string,
        },
        params: {
                email: string,
        },
        body: {
                email: string,
                cnpj: string,
                company_name: string,
                trade_name: string,
                password: string
        }
}
```

### Returns:

A json with an successful message and updated contractor's data

```js
{
        "message": "Foi atualizado",
        "email": contractor.email,
        "password": contractor.password,
        "cnpj": contractor.cnpj,
        "company name": contractor.company_name,
        "trade name": contractor.trade_name
}
```

Error: No contractor found with specified email

```ts
{
        status: 404,
        body: {
                message: "Contractor not found"
        }
}
```

Error: User has not supplied a valid authorization token or is trying to update another contractor

```ts
{
        status: 401,
        body: {
                message: "Unauthorized"
        }
}
```

# Selective_Process's table

# `/proccess` POST method

## **private**

### Expects:

```ts
{
        header: {
                authorization: string,
        },
        body: {
                title: string,
                description: string,
                method_of_contact: string,
                deadline: Date,
        },
}
```

### Returns:

Success:

```js
{
        status: 200,
        body: {
                message: "Foi inserido",
                id: process.id,
                title: process.title,
                description: process.description,
                method_of_contact: process.method_of_contact,
                deadline: process.deadline,
                id_contractor: process.id_contractor

        }
}
```

# `/processo-seletivo` GET method

Finds a selective process with the specified id.

### Expected:

```ts
{
  query: {
    id: Number,
  }
}
```

### Returns:

Success:
A json with an successful message and requested contractor's data

```js
{
        status: 200,
        body: {
                message: "Entry found",
                id: process.id,
                title: process.title,
                description: process.description,
                method_of_contact: process.method_of_contact,
                deadline: process.deadline,
                id_contractor: process.id_contractor
        }
}
```

Error: No process with such id exists

```ts
{
        status: 404,
        body: {
                message: "Process not found",
        }
}
```

Error: id query parameter is not a number

```ts
{
        status: 400,
        body: {
                message: "id is not a number"
        }
}
```

# `/findAllProcess` GET method

### Expected:

Nothing

### Returns:

A json with all contractor's data in database

# `/removeProcess/:id` DELETE method

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

# `/updateProcess/:id` PUT method

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
