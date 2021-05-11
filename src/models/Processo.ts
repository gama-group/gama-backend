import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Processo{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 128
    })
    titulo: string;

    @Column({
        length: 128
    })
    descricao: string;

    @Column({
        type: 'date'
    })
    prazo: string;

    @Column({
        length: 64
    })
    contato: string;

    @Column()
    id_contratante: number;
}