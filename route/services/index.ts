import { Router } from "express";
import { FeaturesController } from "../../model/db/controller/features.controller";

export default Router().post('/api/services', (req, res) => {

    const features = new FeaturesController()

    features
        .getAll()
        .then(feats => {
            const response = feats.map(feat => (
                {
                    type: feat.type,
                    price: feat.price,
                    time: feat.time
                }
            ))
            res.status(200).send({ features: response })
        })
        .catch(_ => {
            res.status(404).send({ message: "no-content" })
        })
})