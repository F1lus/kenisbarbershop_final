import {Router} from "express";
import {OpeninghrsController} from "../../model/db/controller/openinghrs.controller";

export default Router().post('/workdays', (req, res) => {
    const openHrs = new OpeninghrsController()

    openHrs.selectWorkingDays()
        .then(days => {
            res.send({ days })
        })
        .catch(() => {
            res.status(500).send()
        })
})