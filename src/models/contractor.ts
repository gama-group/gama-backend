import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Contractor {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 64
    })
    email: string;

    @Column()
    password: string;

    @Column({
        length: 128
    })
    company_name: string;

    @Column({
        length: 128
    })
    trade_name: string;

    @Column({
        length: 14
    })
    cnpj: string;
}