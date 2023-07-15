"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var openinghrs_controller_1 = require("../../model/db/controller/openinghrs.controller");
var features_controller_1 = require("../../model/db/controller/features.controller");
exports.default = (0, express_1.Router)().post('/workdays', function (req, res) {
    var openHrs = new openinghrs_controller_1.OpeninghrsController();
    var features = new features_controller_1.FeaturesController();
    var tempDays = undefined;
    openHrs.selectWorkingDays()
        .then(function (days) {
        tempDays = days;
        return features.getServices();
    })
        .then(function (services) {
        res.send({ days: tempDays, services: services });
    })
        .catch(function () {
        res.status(500).send();
    });
});
