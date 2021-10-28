# Gama-backend

Backend of the Software Engineering II discipline project

## :rocket: Getting started

# Technologies

The following tools were used in the construction of the project:

- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/)
- [Express](https://expressjs.com/)
- [JWT](https://jwt.io/)

# Prerequisites

Before starting, you will need to have the following tools installed on your machine: [Yarn](https://yarnpkg.com/), [Node.js](https://nodejs.org/en/).

# Useful commands

Install dependencies

    yarn

Run unit tests

    yarn test

Build everything (outputs will live in `dist/`-directory)

    yarn build

Start development server

    yarn dev

# Setting environment variables

For the application to work, the environment variables must be correctly configured for your environment.
If you are running locally, you must have the local variable:

    TYPEORM_ENTITIES = src/models/*.ts

If it's running in production, set the local variable to:

    TYPEORM_ENTITIES = dist/models/*.js
    PORT = // Where express will run. By default is 3333
    BCRYPT_SALT_ROUNDS = // How many iterations are used to generate the salt
    JWT_SECRET_KEY = // Secrect key for JWT

The existing routes for CRUD operations:

# Contractors' Routes

# `/login` POST method

### Expects

```ts
{
        body: {
                email: string,
                password: string,
        }
}
```

### Returns

Success

```ts
{
        status: 200,
        body: {
                authorization: string
        },
}
```

Error: Username or password is invalid

```ts
{
        status: 403,
        body: {
                message: "Invalid username or password"
        }
}
```

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
                message: "Insertion completed",
                id: contractor.id,
                email: contractor.email,
                password: contractor.password,
                cnpj: contractor.cnpj,
                company_name: contractor.company_name,
                trade_name: contractor.trade_name
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
                message: "Foi encontrado",
                email: contractor.email,
                password: contractor.password,
                cnpj: contractor.cnpj,
                company_name: contractor.company_name,
                trade_name: contractor.trade_name
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

# `/contratante/todos` GET method

### Expects:

Nothing

### Returns:

A json array with all contractors' data from the database

```ts
{
        status: 200,
        body: [
                {
                id: contractor.id,
                email: contractor.email,
                password: contractor.password,
                cnpj: contractor.cnpj,
                company_name: contractor.company_name,
                trade_name: contractor.trade_name
                },
                {
                        ...
                },
                ...
        ]
}
```

# `/contratante/:email` DELETE method

## **private**

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
        message: "Foi removido.",
        email: contractor.email,
        password: contractor.password,
        cnpj: contractor.cnpj,
        company_name: contractor.company_name,
        trade_name: contractor.trade_name
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

# `/contratante/:id` PUT method

## **private**

### Expects:

```ts
{
        header: {
                authorization: string,
        },
        params: {
                id: string,
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
        message: "Foi atualizado",
        email: contractor.email,
        password: contractor.password,
        cnpj: contractor.cnpj,
        company_name: contractor.company_name,
        trade_name: contractor.trade_name
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

# Selective Processes' Routes

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

# `/processo-seletivo/todos` GET method

Retrieves all selective processes

### Expects:

Nothing

### Returns:

```ts
[
        {
                id: Number,
                title: string,
                description: string,
                deadline: string,
                method_of_contact: string,
        },
        {
                ...
        },
        ...
]
```

# `/processo-seletivo/:id` DELETE method

## **private**

Removes a selective process with the specified id.

### Expects:

```ts
{
  header: {
          authorization: string,
  },
  params: {
    id: Number;
  }
}
```

### Returns:

A json with an successful message and deleted process' data

```js
{
        status: 200,
        body: {
                message: "Foi removido",
                id: process.id,
                title: process.title,
                description: process.description,
                method_of_contact: process.method_of_contact,
                deadline: process.deadline,
                id_contractor: process.id_contractor,
        };
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

Error: id query parameter is not a number

```ts
{
        status: 400,
        body: {
                message: "id is not a number"
        }
}
```

# `/processo-seletivo/:id` PUT method

## **private**

Updates a selective process data

### Expects:

```ts
{
        params: {
                id: Number,
        },
        header: {
                authorization: string;
        },
        body: {
                title: string,
                description: string,
                method_of_contact: string,
                deadline: Date
        }
}
```

### Returns:

Success:

```js
{
        status: 200,
        body: {
                message: "Entry updated",
                id: process.id,
                title: process.title,
                description: process.description,
                method_of_contact: process.method_of_contact,
                deadline: process.deadline,
                id_contractor: process.id_contractor
        }
}
```

# Contributing

Thanks for being interested in contributing! We’re so glad you want to help! All type of contributions are welcome, such as bug fixes, issues or feature requests.

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.

Please note we have a code of conduct, please follow it in all your interactions with the project.

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a
   build.
2. Update the README.md with details of changes to the interface, this includes new environment
   variables, exposed ports, useful file locations and container parameters.
3. Increase the version numbers in any examples files and the README.md to the new version that this
   Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
4. You may merge the Pull Request in once you have the sign-off of two other developers, or if you
   do not have permission to do that, you may request the second reviewer to merge it for you.

## Code of Conduct

### Our Pledge

In the interest of fostering an open and welcoming environment, we as
contributors and maintainers pledge to making participation in our project and
our community a harassment-free experience for everyone, regardless of age, body
size, disability, ethnicity, gender identity and expression, level of experience,
nationality, personal appearance, race, religion, or sexual identity and
orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment
include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

Examples of unacceptable behavior by participants include:

- The use of sexualized language or imagery and unwelcome sexual attention or
  advances
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information, such as a physical or electronic
  address, without explicit permission
- Other conduct which could reasonably be considered inappropriate in a
  professional setting

### Our Responsibilities

Project maintainers are responsible for clarifying the standards of acceptable
behavior and are expected to take appropriate and fair corrective action in
response to any instances of unacceptable behavior.

Project maintainers have the right and responsibility to remove, edit, or
reject comments, commits, code, wiki edits, issues, and other contributions
that are not aligned to this Code of Conduct, or to ban temporarily or
permanently any contributor for other behaviors that they deem inappropriate,
threatening, offensive, or harmful.

### Scope

This Code of Conduct applies both within project spaces and in public spaces
when an individual is representing the project or its community. Examples of
representing a project or community include using an official project e-mail
address, posting via an official social media account, or acting as an appointed
representative at an online or offline event. Representation of a project may be
further defined and clarified by project maintainers.

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported by contacting the project team. All
complaints will be reviewed and investigated and will result in a response that
is deemed necessary and appropriate to the circumstances. The project team is
obligated to maintain confidentiality with regard to the reporter of an incident.
Further details of specific enforcement policies may be posted separately.

Project maintainers who do not follow or enforce the Code of Conduct in good
faith may face temporary or permanent repercussions as determined by other
members of the project's leadership.

# License

MIT © [Gama-Group](https://github.com/gama-group)



