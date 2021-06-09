# Models

## Create a Model
Working with a database starts from creating tables. How do you tell TypeORM to create a database table? The answer is - through the models.
Your models in your app are your database tables.

## Create an entity
Entity is your model decorated by an ``@Entity`` decorator. A database table will be created for such models.

## Adding table columns
To add database columns, you simply need to decorate an entity's properties you want to make into a column with a ``@Column`` decorator.

## Creating a primary column
Each entity must have at least one primary key column. This is a requirement and you can't avoid it. To make a column a primary key, you need to use ``@PrimaryColumn`` decorator.

## Example
Here is an example of a model used in the application. 
```
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
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
