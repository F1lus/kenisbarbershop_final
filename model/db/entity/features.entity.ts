import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Features{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    type: string

    @Column()
    price: number

    @Column()
    time: number
    
}