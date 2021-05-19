import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Selective_Process } from './selective_process'

@Entity()
export class Contractor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
      length: 64,
      unique: true
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

    @OneToMany(() => Selective_Process, process => process.contractor)
    processes: Selective_Process[];
}
