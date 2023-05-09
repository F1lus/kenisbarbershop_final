"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbSource = void 0;
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var dotenv_1 = require("dotenv");
var openinghrs_1 = require("./model/db/entity/openinghrs");
(0, dotenv_1.config)();
exports.dbSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number.parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB,
    entities: [openinghrs_1.Openinghrs],
    logging: true,
    synchronize: true,
});
