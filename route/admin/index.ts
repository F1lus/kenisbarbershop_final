import {Router} from "express";
import {OpeninghrsController} from "../../model/db/controller/openinghrs.controller";
import {FeaturesController} from "../../model/db/controller/features.controller";

const admin = Router()

admin.post('/getAdmin', (req, res) => {
    const ohr = new OpeninghrsController()
    const features = new FeaturesController()
    
    let tempOhr = undefined
    ohr.selectAll()
        .then(hours => {
            tempOhr = hours
            return features.getAll()
        })
        .then(feats => {
            res.status(200).send({ days: [ ...tempOhr ], services: [ ...feats, { type: '', price: 0, time: 0 } ] })
        })
        .catch(err => {
            res.status(404).send()
        })
})

admin.post('/deleteService', (req, res) => {
    console.log(req.body)
    
    //TODO
})

admin.post('/saveForm', (req, res) => {
    console.log(req.body)
    
    //TODO
})

export default admin