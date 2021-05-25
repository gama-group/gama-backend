import request from 'supertest';
import { validate as isUuid } from 'uuid';
import { genUserToken, authMiddleware, unauthorized } from '../helpers/authentication'
import { Connection, ConnectionManager, createConnection } from 'typeorm'
import { app } from '../index';

describe('GET /addProcess', () => {
    beforeEach(async () => {
        const connection = await createConnection()
        await connection.dropDatabase()
        await connection.close()
    })

    it('should be able to create a new process', async () => {
        const user_response = await request(app).post('/adiciona').send({
            email: 'test@test.com.br',
            cnpj: '12345678900000',
            company_name: 'Company Name Test',
            trade_name: 'Trade Name Test',
            password: '1234'
        });

        const login = await request(app).post('/login').send({
            email: user_response.body.email,
            password: '1234',
        });

        const response = await request(app).post('/addProcess').set('Authorization', login.body.authorization).send({
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
});

describe('GET /findProcessByTitle', () => {
    beforeEach(async () => {
        const connection = await createConnection()
        await connection.dropDatabase()
        await connection.close()

        await request(app).post('/adiciona').send({
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

        await request(app).post('/addProcess').set('Authorization', login.body.authorization).send({
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
});

describe('GET /findAllProcess', () => {
    beforeEach(async () => {
        const connection = await createConnection()
        await connection.dropDatabase()
        await connection.close()

        await request(app).post('/adiciona').send({
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

        await request(app).post('/addProcess').set('Authorization', login.body.authorization).send({
            title: 'title',
            description: 'test',
            deadline: 'test',
            method_of_contact: 'test'
        });

        await request(app).post('/addProcess').set('Authorization', login.body.authorization).send({
            title: 'title 2',
            description: 'test',
            deadline: 'test',
            method_of_contact: 'test'
        });
    })

    it('should be able to find a process by title', async () => {
        const response = await request(app).get('/findAllProcess')

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
});

describe('GET /findProcessById', () => {
    beforeEach(async () => {
        const connection = await createConnection()
        await connection.dropDatabase()
        await connection.close()

        await request(app).post('/adiciona').send({
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

        await request(app).post('/addProcess').set('Authorization', login.body.authorization).send({
            title: 'title',
            description: 'test',
            deadline: 'test',
            method_of_contact: 'test'
        });
    })

    it('should be able to find a process by title', async () => {
        const response = await request(app).get('/findProcessById').query({
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
});

describe('DELETE /removeProcess', () => {
    beforeEach(async () => {
        const connection = await createConnection()
        await connection.dropDatabase()
        await connection.close()

        await request(app).post('/adiciona').send({
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

        await request(app).post('/addProcess').set('Authorization', login.body.authorization).send({
            title: 'title',
            description: 'test',
            deadline: 'test',
            method_of_contact: 'test'
        });
    })

    it('should be able to remove a process', async () => {
        const response = await request(app).get('/removeProcess').query({
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
});