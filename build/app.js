"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
var express = require("express");
var cors = require("cors");
var helmet_1 = require("helmet");
var http = require("http");
var https = require("https");
var fs_1 = require("fs");
var appointment_1 = require("./route/appointment");
var reserve_1 = require("./route/reserve");
var source_1 = require("./model/db/source");
var services_1 = require("./route/services");
(0, dotenv_1.config)();
var app = express();
source_1.dbSource.initialize().then(function () { return console.log('OK'); });
var server = null;
if (process.env.ENVIRONMENT === 'prod') {
    server = https.createServer({
        key: (0, fs_1.readFileSync)('c0d4b_12d6b_2b2bf5b4f1f881468dd2c4ff58e1ef58.key', 'utf8'),
        cert: (0, fs_1.readFileSync)('_wildcard__kenisbarbershop_hu_c0d4b_12d6b_1632348761_d183f1424bdb56fcb46650ed991ec4d7.crt', 'utf8')
    }, app);
}
var server2 = http.createServer(app);
var path = __dirname + '/react';
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path));
app.use((0, helmet_1.default)());
app.use(helmet_1.default.contentSecurityPolicy({
    directives: {
        connectSrc: ["'self'", "https://kenisbarbershop.hu"],
        frameSrc: ["'self'", "https://maps.google.com"]
    }
}));
app.use(cors());
app.use(appointment_1.default);
app.use(reserve_1.default);
app.use(services_1.default);
app.get('*', function (req, res) {
    res.sendFile(path + '/index.html');
});
if (process.env.ENVIRONMENT === 'prod') {
    server.listen(4000, function () {
        console.log('HTTPS Online!');
    });
}
server2.listen(8080, function () {
    console.log('HTTP Online');
});
