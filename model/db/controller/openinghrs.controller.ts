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
        return this.repository.find();
    }
    set(openingHrs: Openinghrs): Promise<Openinghrs> {
        return new Promise(async (resolve, reject) => {
            try {
                const openinghrsToUpdate = await this.repository.findOneById(openingHrs.id);
                if (!openinghrsToUpdate) {
                    throw new Error(`A nyitvatartás ezzel az ${openingHrs.id} -val nem található.`);
                }
                openinghrsToUpdate.openhr = openingHrs.openhr;
                openinghrsToUpdate.closehr = openingHrs.closehr;
                openinghrsToUpdate.openmin = openingHrs.openmin;
                openinghrsToUpdate.closemin = openingHrs.closemin;
                openinghrsToUpdate.active = openingHrs.active;
                openinghrsToUpdate.day = openingHrs.day;
                const updatedOpeninghrs = await this.repository.save(openinghrsToUpdate);
                resolve(updatedOpeninghrs);
            } catch (error) {
                reject(error);
            }
        });
    }

    async selectWorkingDays(){
        const ohr = await this.repository.find()
        return ohr.filter(o => o.active !== 0).map(o => parseInt(o.day))
    }

}