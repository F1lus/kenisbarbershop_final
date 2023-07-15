import {Router} from "express";
import {OpeninghrsController} from "../../model/db/controller/openinghrs.controller";
import {FeaturesController} from "../../model/db/controller/features.controller";
import { features } from "process";
import services from "../services";

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
    features.delete(req.body.id);
})

admin.post('/saveForm', async (req, res) => {
    const ohr = new OpeninghrsController()
    const features = new FeaturesController()
    const services = req.body.services;
    const days = req.body.days;

    services.forEach(element => {
        if(element.id != null)features.update(element.id, element);
        else features.insert(element.price,element.time,element.type);
    });
    days.forEach(element => {
       ohr.set(element);
    });
})

export default admin