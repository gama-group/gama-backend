import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Contractor } from './contractor'

@Entity()
export class Selective_Process {
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

    @ManyToOne(() => Contractor, contractor => contractor.processes)
    contractor: Contractor;
}
