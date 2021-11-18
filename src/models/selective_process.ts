import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Contractor } from './contractor'

@Entity()
export class SelectiveProcess {
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
    methodOfContact: string;

    @ManyToOne(() => Contractor, contractor => contractor.processes, {
      cascade: true,
      onDelete: 'CASCADE'
    })
    contractor: Contractor;
}
