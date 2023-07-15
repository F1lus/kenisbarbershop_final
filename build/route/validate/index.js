"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var jsonwebtoken_1 = require("jsonwebtoken");
exports.default = (0, express_1.Router)().post('/validate', function (req, res) {
    var token = req.body.token;
    if (!token) {
        res.status(401).send();
    }
    try {
        var decoded = (0, jsonwebtoken_1.verify)(token, process.env.SECRET);
        if (decoded.hash === process.env.JWT_AUTH) {
            res.status(200).send({ auth: true });
        }
        else {
            res.status(401).send();
        }
    }
    catch (_a) {
        res.status(401).send();
    }
});
