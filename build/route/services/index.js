"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var features_controller_1 = require("../../model/db/controller/features.controller");
exports.default = (0, express_1.Router)().post('/api/services', function (req, res) {
    var features = new features_controller_1.FeaturesController();
    features
        .getAll()
        .then(function (feats) {
        var response = feats.map(function (feat) { return ({
            type: feat.type,
            price: feat.price,
            time: feat.time
        }); });
        res.status(200).send({ features: response });
    })
        .catch(function (_) {
        res.sendStatus(404);
    });
});
