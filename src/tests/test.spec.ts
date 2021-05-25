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
            method_of_contact: 'test',
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

describe('GET /processo-seletivo/:id', () => {
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

    await request(app).post('/processo-seletivo').set('Authorization', login.body.authorization).send({
      title: 'title2',
      description: 'test2',
      deadline: 'test2',
      method_of_contact: 'test2'
    });
  })

  it('should be able to get process by contractor id', async () => {
    const response = await request(app).get('/processo-seletivo/1')

    expect(response.body).toMatchObject(
      {
        "0": {
          "id": 1,
          "title": "title",
          "description": "test",
          "deadline": "test",
          "method_of_contact": "test"
        },
        "1": {
          "id": 2,
          "title": "title2",
          "description": "test2",
          "deadline": "test2",
          "method_of_contact": "test2"
        }
      }
    );
  })

  it('should be able to get process by contractor id 2', async () => {
    
    await request(app).post('/contratante').send({
      email: 'test2@test2.com.br',
      cnpj: '12345678900000',
      company_name: 'Company Name Test2',
      trade_name: 'Trade Name Test2',
      password: '1234'
    });

    const login2 = await request(app).post('/login').send({
      email: 'test2@test2.com.br',
      password: '1234',
    });

    await request(app).post('/processo-seletivo').set('Authorization', login2.body.authorization).send({
      title: 'title3',
      description: 'test3',
      deadline: 'test3',
      method_of_contact: 'test3'
    });

    const response = await request(app).get('/processo-seletivo/2')

    expect(response.body).toMatchObject(
      {
        "0": {
          "id": 3,
          "title": "title3",
          "description": "test3",
          "deadline": "test3",
          "method_of_contact": "test3"
        }
      }
    );
  })

  it('should return a empty list', async () => {
    const response = await request(app).get('/processo-seletivo/:id').query({
      id: 123
    })

    expect(response.body).toMatchObject(
      {}
    );
  })
})

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

describe('POST /contratante', () => {
    beforeEach(async () => {
      const connection = await createConnection()
      await connection.dropDatabase()
      await connection.close()
    })
    it('should add sucessfuly contractor', async () => {
      const response = await request(app).post('/contratante').send({
        email: 'america@company.com',
        cnpj: '12345678910111',
        company_name: 'America',
        trade_name: 'America',
        password: '123'
      })

      expect(response.body).toMatchObject({
        email: 'america@company.com',
        cnpj: '12345678910111',
        company_name: 'America',
        trade_name: 'America'
      })
    })

    it('shouldnt be able to add existing contractor', async () => {
      await request(app).post('/contratante').send({
        email: 'america@company.com',
        cnpj: '12345678910111',
        company_name: 'America',
        trade_name: 'America',
        password: '123'
      })

      const response1 = await request(app).post('/contratante').send({
        email: 'america@company.com',
        cnpj: '12345678910111',
        company_name: 'America',
        trade_name: 'America',
        password: '123'
      })

      expect(response1.body).toMatchObject({
        message: 'Unable to create user.'
      })
    })
  })

  describe('GET /contratante', () => {
    beforeEach(async () => {
      const connection = await createConnection()
      await connection.dropDatabase()
      await connection.close()
    })

    it('shouldnt find someone', async () => {
      const response = await request(app).get('/contratante?email=america@company.com')
      expect(response.body).toMatchObject({
        message: 'contractor not found'
      })
    })

    it('should find someone', async () => {
      await request(app).post('/contratante').send({
        email: 'america@company.com',
        cnpj: '12345678910111',
        company_name: 'America',
        trade_name: 'America',
        password: '123'
      })
      const response = await request(app).get('/contratante?email=america@company.com')
      expect(response.body).toMatchObject({
        message: 'Foi encontrado'
      })
    })
    it('should fail because missing query', async () => {
      const response = await request(app).get('/contratante')
      expect(response.body).toMatchObject({
        'bad request': 'email is not a string'
      })
    })
  })

  describe('GET /contratante/todos', () => {
    beforeEach(async () => {
      const connection = await createConnection()
      await connection.dropDatabase()
      await connection.close()
    })
    it('should find everyone', async () => {
      await request(app).post('/contratante').send({
        email: 'america@company.com',
        cnpj: '12345678910111',
        company_name: 'America',
        trade_name: 'America',
        password: '123'
      })
      await request(app).post('/contratante').send({
        email: 'facebook@company.com',
        cnpj: '12345678910111',
        company_name: 'Facebook Corp',
        trade_name: 'Facebook',
        password: '123'
      })
      const response = await request(app).get('/contratante/todos')
      expect(Object.keys(response.body).length).toBe(2)
    })
  })

  describe('DELETE /contratante/:email', () => {
    beforeEach(async () => {
      const connection = await createConnection()
      await connection.dropDatabase()
      await connection.close()
      await request(app).post('/contratante').send({
        email: 'facebook@company.com',
        cnpj: '12345678910111',
        company_name: 'Facebook Corp',
        trade_name: 'Facebook',
        password: '123'
      })
    })
    it('shouldnt allow removal because unauthorized acess', async () => {
      const response = await request(app).delete('/contratante/america@company.com')

      expect(response.body).toMatchObject({
        message: 'Unauthorized'
      })
    })

    it('shouldnt allow removal because dont exists contractor looked for', async () => {
      const login = await request(app).post('/login').send({
        email: 'facebook@company.com',
        password: '123'
      })

      const response = await request(app).delete('/contratante/america@company.com').set('Authorization', login.body.authorization)
      expect(response.body).toMatchObject({
        message: 'Contractor not found'
      })
    })

    it('shouldnt allow removal because user dont have credentials to remove', async () => {
      const login = await request(app).post('/login').send({
        email: 'facebook@company.com',
        password: '123'
      })
      await request(app).post('/contratante').send({
        email: 'america@company.com',
        cnpj: '12345678910111',
        company_name: 'America',
        trade_name: 'America',
        password: '123'
      })
      await request(app).post('/contratante').send({
        email: 'amazon@company.com',
        cnpj: '12345678910111',
        company_name: 'Amazon Enterprise',
        trade_name: 'AmaZon',
        password: '123'
      })
      const response = await request(app).delete('/contratante/america@company.com').set('Authorization', login.body.authorization)
      expect(response.body).toMatchObject({message: 'Unauthorized'})
    })

    it('should remove successfully', async () => {
      const login = await request(app).post('/login').send({
        email: 'facebook@company.com',
        password: '123'
      })
      await request(app).post('/contratante').send({
        email: 'america@company.com',
        cnpj: '12345678910111',
        company_name: 'America',
        trade_name: 'America',
        password: '123'
      })
      await request(app).post('/contratante').send({
        email: 'amazon@company.com',
        cnpj: '12345678910111',
        company_name: 'Amazon Enterprise',
        trade_name: 'AmaZon',
        password: '123'
      })
      const response = await request(app).delete('/contratante/facebook@company.com').set('Authorization', login.body.authorization)
      expect(response.body).toMatchObject({ message: 'Foi Removido' })
    })
  })

  describe('PUT /update', () => {
    beforeEach(async () => {
      const connection = await createConnection()
      await connection.dropDatabase()
      await connection.close()
      await request(app).post('/contratante').send({
        email: 'america@company.com',
        cnpj: '12345678910111',
        company_name: 'America',
        trade_name: 'America',
        password: '123'
      })
      await request(app).post('/contratante').send({
        email: 'facebook@company.com',
        cnpj: '12345678910111',
        company_name: 'Facebook Corp',
        trade_name: 'Facebook',
        password: '123'
      })
    })
    it('should update successfully contractor', async () => {
      const login = await request(app).post('/login').send({
        email: 'america@company.com',
        password: '123'
      })

      const response = await request(app).put('/contratante/america@company.com').set('Authorization', login.body.authorization).send({
        email: 'americana@company.com.br',
        cnpj: '12345678900001',
        company_name: 'Americana',
        trade_name: 'Americana Company',
        password: '123abc'
      })

      expect(response.body).toMatchObject({
        message: 'Foi atualizado'
      })
    })

    it('shouldnt update contractor because credentials didnt match', async () => {
      const login = await request(app).post('/login').send({
        email: 'america@company.com',
        password: '123'
      })

      const response = await request(app).put('/contratante/facebook@company.com').set('Authorization', login.body.authorization).send({
        email: 'americana@company.com.br',
        cnpj: '12345678900001',
        company_name: 'Americana',
        trade_name: 'Americana Company',
        password: '123abc'
      })

      expect(response.body).toMatchObject({
        message: 'Unauthorized'
      })
    })

    it('shouldnt update because unauthorized acess', async () => {
      const response = await request(app).put('/contratante/america@company.com').send({
        email: 'americana@company.com.br',
        cnpj: '12345678900001',
        company_name: 'Americana',
        trade_name: 'Americana Company',
        password: '123abc'
      })
      expect(response.body).toMatchObject({
        message: 'Unauthorized'
      })
    })

    it('shouldnt update because contractor wasnt inserted', async () => {
      const login = await request(app).post('/login').send({
        email: 'facebook@company.com',
        password: '123'
      })

      const response = await request(app).put('/contratante/tesla@company.com').set('Authorization', login.body.authorization).send({
        email: 'tesla.motors@company.com.br',
        cnpj: '12345678900001',
        company_name: 'Tesla Motors',
        trade_name: 'Tesla Motors Company',
        password: '123abc'
      })
      expect(response.body).toMatchObject({
        message: 'Contractor not found'
      })
    })
  })

  describe('POST/login', () => {
      beforeEach(async () =>{
          const connection = await createConnection()
          await connection.dropDatabase()
          await connection.close()

          await request(app).post('/contratante').send({
            email: 'bethesda@zenimax.com',
            cnpj: '11101987654321',
            company_name: 'Bethesda Softworks',
            trade_name: 'Bethesda',
            password: 'password'
          })
      })

      it('should log in successfully, given the right credentials', async () => {
          const login = await request(app).post('/login').send({
            email: 'bethesda@zenimax.com',
            password: 'password'
          })

          expect(login.status).toBe(200)
      })

      it('should not log in if the username is incorrect', async () => {
          const login = await request(app).post('/login').send({
              email: 'betesda@zenimax.com',
              password: 'password'
          })

          expect(login.status).toBe(403)
      })

      it('should not log in if the password is incorrect', async () => {
          const login = await request(app).post('/login').send({
              email: 'bethesda@zenimax.com',
              password: 'passcode'
          })

          expect(login.status).toBe(403)
      })
  })
