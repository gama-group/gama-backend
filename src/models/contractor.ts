import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { SelectiveProcess } from './selective_process'

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
    companyName: string;

    @Column({
      length: 128
    })
    tradeName: string;

    @Column({
      length: 14
    })
    cnpj: string;

    @OneToMany(() => SelectiveProcess, process => process.contractor)
    processes: SelectiveProcess[];
}
