import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Selective_Process{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 128
    })
    title: string;

    @Column({
        length: 128
    })
    description: string;

    @Column({
        type: 'date'
    })
    deadline: string;

    @Column({
        length: 64
    })
    method_of_contact: string;

    @Column()
    id_contractor: number;
}