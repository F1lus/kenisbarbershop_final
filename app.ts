import { config } from 'dotenv'

import * as express from 'express'
import * as cors from 'cors'
import helmet from 'helmet'
import * as http from 'http'
import * as https from 'https'
import { readFileSync } from 'fs'

import appointment from './route/appointment'
import reserve from './route/reserve'
import { dbSource } from './model/db/source'
import services from './route/services'
import login from './route/login'
import workdays from "./route/workdays";
import validate from "./route/validate";
import admin from "./route/admin";

config()

const app = express()

dbSource.initialize().then(() => console.log('OK'))

let server: https.Server = null
if(process.env.ENVIRONMENT === 'prod'){
    server = https.createServer({
        key: readFileSync('c0d4b_12d6b_2b2bf5b4f1f881468dd2c4ff58e1ef58.key', 'utf8'),
        cert: readFileSync('_wildcard__kenisbarbershop_hu_c0d4b_12d6b_1632348761_d183f1424bdb56fcb46650ed991ec4d7.crt', 'utf8')
    }, app)
}

const server2 = http.createServer(app)
const path = __dirname + '/react'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path))

app.use(helmet())
app.use(helmet.contentSecurityPolicy({
    directives: {
        connectSrc: ["'self'", "https://kenisbarbershop.hu"],
        frameSrc: ["'self'", "https://maps.google.com"]
    }
}))
app.use(cors())

app.use(appointment)
app.use(reserve)
app.use(services)
app.use(login)
app.use(workdays)
app.use(validate)
app.use(admin)

app.get('*', (req, res) => {
    res.sendFile(path + '/index.html')
})

if(process.env.ENVIRONMENT === 'prod'){
    server.listen(4000, () => {
        console.log('HTTPS Online!')
    })
}

server2.listen(8080, () => {
    console.log('HTTP Online')
})