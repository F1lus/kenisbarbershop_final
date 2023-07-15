import {Router} from "express";
import {OpeninghrsController} from "../../model/db/controller/openinghrs.controller";
import {FeaturesController} from "../../model/db/controller/features.controller";

export default Router().post('/workdays', (req, res) => {
    const openHrs = new OpeninghrsController()
    const features = new FeaturesController()
    let tempDays = undefined
    openHrs.selectWorkingDays()
        .then(days => {
            tempDays = days
            return features.getServices()
        })
        .then(services => {
            res.send({ days: tempDays, services })
        })
        .catch(() => {
            res.status(500).send()
        })
})