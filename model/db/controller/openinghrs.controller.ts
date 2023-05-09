import { dbSource } from "../source";
import { Openinghrs } from "../entity/openinghrs";
import { Repository } from "typeorm";
import { DateTime } from "luxon";

export class OpeninghrsController {

    private repository: Repository<Openinghrs>

    constructor() {
        this.repository = dbSource.getRepository(Openinghrs)
    }

    selectAll() {
        return this.repository.find()
    }

    toWeekday(ohr: Openinghrs) {
        switch(ohr.day){
            case "Hétfő": return 1;
            case "Kedd": return 2;
            case "Szerda": return 3;
            case "Csütörtök": return 4;
        }
    }

}