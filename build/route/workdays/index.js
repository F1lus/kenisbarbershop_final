"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var openinghrs_controller_1 = require("../../model/db/controller/openinghrs.controller");
exports.default = (0, express_1.Router)().post('/workdays', function (req, res) {
    var openHrs = new openinghrs_controller_1.OpeninghrsController();
    openHrs.selectWorkingDays()
        .then(function (days) {
        res.send({ days: days });
    })
        .catch(function () {
        res.status(500).send();
    });
});
