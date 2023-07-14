"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var bcryptjs_1 = require("bcryptjs");
var jsonwebtoken_1 = require("jsonwebtoken");
var user_controller_1 = require("../../model/db/controller/user.controller");
exports.default = (0, express_1.Router)().post('/login', function (req, res) {
    var request = req.body;
    var uc = new user_controller_1.UserController();
    uc.validateUser(request.username)
        .then(function (user) {
        if ((0, bcryptjs_1.compareSync)(request.password, user.password)) {
            var token = (0, jsonwebtoken_1.sign)({
                user: request.username,
                hash: process.env.JWT_AUTH
            }, process.env.SECRET, { expiresIn: '1h' });
            res.send({ token: token });
        }
        else {
            res.status(401).send();
        }
    }).catch(function (err) {
        console.log(err);
        res.status(401).send();
    });
});
