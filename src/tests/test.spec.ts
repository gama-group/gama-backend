import request from 'supertest';
import { validate as isUuid } from 'uuid';
import { genUserToken, authMiddleware, unauthorized } from '../helpers/authentication'
import { Connection, ConnectionManager, createConnection } from 'typeorm'
import { app } from '../index';

describe('POST /processo-seletivo', () => {
    beforeEach(async () => {
        const connection = await createConnection()
        await connection.dropDatabase()
        await connection.close()

        await request(app).post('/contratante').send({
            email: 'test@test.com.br',
            cnpj: '12345678900000',
            company_name: 'Company Name Test',
            trade_name: 'Trade Name Test',
            password: '1234'
        });
    })

    it('should be able to create a new process', async () => {
        const login = await request(app).post('/login').send({
            email: 'test@test.com.br',
            password: '1234',
        });

        const response = await request(app).post('/processo-seletivo').set('Authorization', login.body.authorization).send({
          title: 'title',
          description: 'test',
          deadline: 'test',
          method_of_contact: 'test'
        });

        expect(response.body).toMatchObject({
            message: 'Foi inserido',
            id: 1,
            title: 'title',
            description: 'test',
            'method of contact': 'test',
            deadline: 'test',
            id_contractor: 1
        });
    });

    it('should not be able to create a new process without authorization', async () => {
        const response = await request(app).post('/processo-seletivo').send({
          title: 'title',
          description: 'test',
          deadline: 'test',
          method_of_contact: 'test'
        });

        expect(response.body).toMatchObject({
            message: 'Unauthorized',
        });
    });
});

describe('GET /findProcessByTitle', () => {
    beforeEach(async () => {
        const connection = await createConnection()
        await connection.dropDatabase()
        await connection.close()

        await request(app).post('/contratante').send({
            email: 'test@test.com.br',
            cnpj: '12345678900000',
            company_name: 'Company Name Test',
            trade_name: 'Trade Name Test',
            password: '1234'
        });

        const login = await request(app).post('/login').send({
            email: 'test@test.com.br',
            password: '1234',
        });

        await request(app).post('/processo-seletivo').set('Authorization', login.body.authorization).send({
            title: 'title',
            description: 'test',
            deadline: 'test',
            method_of_contact: 'test'
        });
    })

    it('should be able to find a process by title', async () => {
        const response = await request(app).get('/findProcessByTitle').query({
            title: 'title'
        })

        expect(response.body).toMatchObject({
            message: 'Foi encontrado',
            id: 1,
            title: 'title',
            description: 'test',
            method_of_contact: 'test',
            deadline: 'test',
            id_contractor: 1
        });
    });

    it('should not be able to find a process by title if the process does not exist', async () => {
        const response = await request(app).get('/findProcessByTitle').query({
            title: 'title 2'
        })

        expect(response.body).toMatchObject({
            message: 'process not found'
        })
    });
});

describe('GET /processo-seletivo/todos', () => {
    beforeEach(async () => {
        const connection = await createConnection()
        await connection.dropDatabase()
        await connection.close()

        await request(app).post('/contratante').send({
            email: 'test@test.com.br',
            cnpj: '12345678900000',
            company_name: 'Company Name Test',
            trade_name: 'Trade Name Test',
            password: '1234'
        });
    })

    it('should be able to find all process', async () => {
        const login = await request(app).post('/login').send({
            email: 'test@test.com.br',
            password: '1234',
        });

        await request(app).post('/processo-seletivo').set('Authorization', login.body.authorization).send({
            title: 'title',
            description: 'test',
            deadline: 'test',
            method_of_contact: 'test'
        });

        await request(app).post('/processo-seletivo').set('Authorization', login.body.authorization).send({
            title: 'title 2',
            description: 'test',
            deadline: 'test',
            method_of_contact: 'test'
        });

        const response = await request(app).get('/processo-seletivo/todos')

        expect(response.body).toMatchObject({
            '0': {
                id: 1,
                title: 'title',
                description: 'test',
                deadline: 'test',
                method_of_contact: 'test'
            },
            '1': {
                id: 2,
                title: 'title 2',
                description: 'test',
                deadline: 'test',
                method_of_contact: 'test'
            }
        });
    });

    it('should find any process', async () => {
        const response = await request(app).get('/processo-seletivo/todos')

        expect(response.body).toMatchObject({});
    });
});

describe('GET /processo-seletivo', () => {
    beforeEach(async () => {
        const connection = await createConnection()
        await connection.dropDatabase()
        await connection.close()

        await request(app).post('/contratante').send({
            email: 'test@test.com.br',
            cnpj: '12345678900000',
            company_name: 'Company Name Test',
            trade_name: 'Trade Name Test',
            password: '1234'
        });

        const login = await request(app).post('/login').send({
            email: 'test@test.com.br',
            password: '1234',
        });

        await request(app).post('/processo-seletivo').set('Authorization', login.body.authorization).send({
            title: 'title',
            description: 'test',
            deadline: 'test',
            method_of_contact: 'test'
        });
    })

    it('should be able to find a process by id', async () => {
        const response = await request(app).get('/processo-seletivo').query({
            id: 1
        })

        expect(response.body).toMatchObject({
            message: 'Foi encontrado',
            id: 1,
            title: 'title',
            description: 'test',
            method_of_contact: 'test',
            deadline: 'test',
            id_contractor: 1
        });
    });

    it('should not be able to find a process if the process does not exist', async () => {
        const response = await request(app).get('/processo-seletivo').query({
            id: 1234
        })

        expect(response.body).toMatchObject({
            message: 'process not found',
        });
    });
});

describe('DELETE /processo-seletivo', () => {
    beforeEach(async () => {
        const connection = await createConnection()
        await connection.dropDatabase()
        await connection.close()

        await request(app).post('/contratante').send({
            email: 'test@test.com.br',
            cnpj: '12345678900000',
            company_name: 'Company Name Test',
            trade_name: 'Trade Name Test',
            password: '1234'
        });
    })

    it('should be able to remove a process', async () => {
        const login = await request(app).post('/login').send({
            email: 'test@test.com.br',
            password: '1234',
        });

        await request(app).post('/processo-seletivo').set('Authorization', login.body.authorization).send({
            title: 'title',
            description: 'test',
            deadline: 'test',
            method_of_contact: 'test'
        });

        const response = await request(app).delete('/processo-seletivo/1').set('Authorization', login.body.authorization)

        expect(response.body).toMatchObject({
            message: 'Foi removido',
            title: 'title',
            description: 'test',
            method_of_contact: 'test',
            deadline: 'test',
            id_contractor: 1
        });
    });

    it('should not be able to remove a process if the process does not exist', async () => {
        const login = await request(app).post('/login').send({
            email: 'test@test.com.br',
            password: '1234',
        });

        const response = await request(app).delete('/processo-seletivo').set('Authorization', login.body.authorization).send({
            id: 123
        })

        expect(response.body).toEqual({})
    });

    it('should not be able to remove a process without authorization', async () => {
        const response = await request(app).delete('/processo-seletivo').send({
            id: '1'
        })

        expect(response.body).toMatchObject({
            message: 'Unauthorized'
        })
    });
});

describe('PUT /processo-seletivo', () => {
    beforeEach(async () => {
        const connection = await createConnection()
        await connection.dropDatabase()
        await connection.close()

        await request(app).post('/contratante').send({
            email: 'test@test.com.br',
            cnpj: '12345678900000',
            company_name: 'Company Name Test',
            trade_name: 'Trade Name Test',
            password: '1234'
        });

        const login = await request(app).post('/login').send({
            email: 'test@test.com.br',
            password: '1234',
        });

        await request(app).post('/processo-seletivo').set('Authorization', login.body.authorization).send({
          title: 'title',
          description: 'test',
          deadline: 'test',
          method_of_contact: 'test'
        });
    })

    it('should be able to update a process', async () => {
        const login = await request(app).post('/login').send({
            email: 'test@test.com.br',
            password: '1234',
        });

        const response = await request(app).put('/processo-seletivo/1').set('Authorization', login.body.authorization).send({
            title: 'new title',
            description: '',
            deadline: 'deadline',
            method_of_contact: ''
        });
        
        expect(response.body).toMatchObject({
            message: 'Foi atualizado',
            id: 1,
            title: 'new title',
            description: '',
            method_of_contact: '',
            deadline: 'deadline',
            id_contractor: 1
        })
    });

    it('should not be able to update a process if the process does not exist', async () => {
        const login = await request(app).post('/login').send({
            email: 'test@test.com.br',
            password: '1234',
        });

        const response = await request(app).put('/processo-seletivo/456').set('Authorization', login.body.authorization).send({
            title: 'new title',
            description: '',
            deadline: 'deadline',
            method_of_contact: ''
        });
        
        expect(response.body).toMatchObject({
            message: 'process not found'
        })
    });

    it('should not be able to update a process without authorization', async () => {
        const response = await request(app).put('/processo-seletivo/1').send({
            title: 'new title',
            description: '',
            deadline: 'deadline',
            method_of_contact: ''
        });
        
        expect(response.body).toMatchObject({
            message: 'Unauthorized'
        })
    });
});