import {Router} from "express";
import {OpeninghrsController} from "../../model/db/controller/openinghrs.controller";
import {FeaturesController} from "../../model/db/controller/features.controller";
import { features } from "process";

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
    const features = new FeaturesController()
    features.delete(req.body.feature.id);
    console.log(req.body)
})

admin.post('/saveForm', async (req, res) => {
    const ohr = new OpeninghrsController()
    const features = new FeaturesController()
    const actualFeatures = await features.getAll();
    const id = actualFeatures.find(req.body.id);

    if(id != null) features.update(req.body.feature.id, req.body.feature);
    else features.insert(req.body.feature.price,req.body.feature.time,req.body.feature.type);
    ohr.set(req.body.openinghrs);
    console.log(req.body)
})

export default admin