module.exports = {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  logging: false,
  ssl: process.env.SSL_ENABLED || true,
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  },
  entities: [
    process.env.TYPEORM_ENTITIES
  ],
  migrations: [
    'src/database/migrations/*.ts'
  ],
  keepConnectionAlive: true,
  synchronize: true
}
