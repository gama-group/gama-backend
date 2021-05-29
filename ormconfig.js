module.exports = {
    "type": process.env.TYPEORM_CONNECTION,
    "host": process.env.TYPEORM_HOST,
    "port": process.env.TYPEORM_PORT,
    "username": process.env.TYPEORM_USERNAME,
    "password": process.env.TYPEORM_PASSWORD,
    "database": process.env.TYPEORM_DATABASE,
    "logging": process.env.TYPEORM_LOGGING,
    "entities": [
       process.env.TYPEORM_ENTITIES
    ],
    "migrations": [
       "src/database/migrations/*.ts"
    ],
    "keepConnectionAlive": true,
    "synchronize": process.env.TYPEORM_SYCHRONIZE
 }
