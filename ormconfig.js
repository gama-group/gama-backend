module.exports = {
    "type": "sqlite",
    "host": "localhost",
    "port": 3333,
    "username": "test",
    "password": "test",
    "database": "db",
    "logging": false,
    "entities": [
       process.env.TYPEORM_ENTITIES
    ],
    "migrations": [
       "src/database/migrations/*.ts"
    ],
    "keepConnectionAlive": true,
    "synchronize": true
 }