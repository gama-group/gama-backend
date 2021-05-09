const db = require("./_database.ts")

const contratante = `
CREATE TABLE contratante(
    id serial not null,
    email varchar(64) not null,
    senha varchar(255) not null,
    razao_social varchar(128) not null,
    nome_fantasia varchar(128) not null,
    cnpj char(14)
);
`;

const processo = `
CREATE TABLE processo(
    id serial not null,
    titulo varchar(128) not null,
    descricao varchar(128) not null,
    prazo date not null,
    contato varchar(64) not null,
    id_contratante serial not null
);
`;

async function createTables() {
    await db.connect()

    await db.query(contratante)
    await db.query(processo)

    await db.end()
 }

createTables()