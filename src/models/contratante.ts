import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Contratante {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 64
    })
    email: string;

    @Column()
    senha: string;

    @Column({
        length: 128
    })
    razao_social: string;

    @Column({
        length: 128
    })
    nome_fantasia: string;

    @Column({
        length: 14
    })
    cnpj: string;
}