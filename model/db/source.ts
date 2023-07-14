import "reflect-metadata"

import { DataSource } from "typeorm"
import { config } from "dotenv"
import { Openinghrs } from "./entity/openinghrs"
import { Features } from "./entity/features.entity"
import {User} from "./entity/user.entity";

config()

export const dbSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number.parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB,
    entities: [ Openinghrs, Features, User ],
    logging: false,
    synchronize: true,
})