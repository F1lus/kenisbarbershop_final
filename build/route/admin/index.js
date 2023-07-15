"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var openinghrs_controller_1 = require("../../model/db/controller/openinghrs.controller");
var features_controller_1 = require("../../model/db/controller/features.controller");
var admin = (0, express_1.Router)();
admin.post('/getAdmin', function (req, res) {
    var ohr = new openinghrs_controller_1.OpeninghrsController();
    var features = new features_controller_1.FeaturesController();
    var tempOhr = undefined;
    ohr.selectAll()
        .then(function (hours) {
        tempOhr = hours;
        return features.getAll();
    })
        .then(function (feats) {
        res.status(200).send({ days: __spreadArray([], tempOhr, true), services: __spreadArray(__spreadArray([], feats, true), [{ type: '', price: 0, time: 0 }], false) });
    })
        .catch(function (err) {
        res.status(404).send();
    });
});
admin.post('/deleteService', function (req, res) {
    console.log(req.body);
    //TODO
});
admin.post('/saveForm', function (req, res) {
    console.log(req.body);
    //TODO
});
exports.default = admin;
