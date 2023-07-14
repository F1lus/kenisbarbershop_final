import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Openinghrs {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    day: string

    //Nyitás óra
    @Column()
    openhr: string

    //Zárás óra
    @Column()
    closehr: string 

    //Nyitás perc
    @Column()
    openmin: string

    //Zárás perc
    @Column()
    closemin: string 
    //Aktív
    @Column()
    active: number
}