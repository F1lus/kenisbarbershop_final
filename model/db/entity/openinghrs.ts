import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Openinghrs {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    day: string

    //Nyitás
    @Column()
    open: string

    //Zárás
    @Column()
    close: string 
}