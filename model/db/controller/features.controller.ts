import { dbSource } from "../source";
import { Features } from "../entity/features.entity";
import { Repository } from "typeorm";

interface FeatureArgs {
    price?: number
    time?: number
    type?: string
}

export class FeaturesController {

    private repository: Repository<Features>

    constructor() {
        this.repository = dbSource.getRepository(Features)
    }

    getAll() {
        return this.repository.find()
    }

    insert(price: number, time: number, type: string) {
        return new Promise((resolve, reject) => {
            const feature = new Features()

            feature.price = price
            feature.time = time
            feature.type = type

            this.repository
                .save(feature)
                .then(_ => resolve("OK"))
                .catch(_ => reject("ERROR"))
        })
    }

    update(id: number, args: FeatureArgs) {
        return new Promise((resolve, reject) => {
            this.repository.findOneBy({
                id
            })
            .then(feature => {
                if(!feature) {
                    resolve("FAIL")
                }
                let shouldUpdate = false

                if(args.price){
                    feature.price = args.price
                    shouldUpdate = true
                }
                if(args.time){
                    feature.time = args.time
                    shouldUpdate = true
                }

                if(args.type){
                    feature.type = args.type
                    shouldUpdate = true
                }

                if(!shouldUpdate) resolve("OK")

                return this.repository.save(feature)
            })
            .then(_ => resolve("OK"))
            .catch(_ => reject("ERROR"))
        })
    }

    delete(id: number) {
        return new Promise((resolve, reject) => {
            this.repository
                .findOneBy({ id })
                .then(feature => this.repository.remove(feature))
                .then(_ => resolve("OK"))
                .catch(_ => reject("ERROR"))
        })
    }
}