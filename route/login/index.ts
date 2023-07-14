import { Router } from "express";
import { compareSync } from "bcryptjs";
import { sign } from 'jsonwebtoken'
import {UserController} from "../../model/db/controller/user.controller";

interface UserData {
    username: string,
    password: string
}
export default Router().post('/login', (req, res) => {
    
    const request: UserData = req.body
    const uc = new UserController()
    
    uc.validateUser(request.username)
        .then(user => {
            if(compareSync(request.password, user.password)){
                const token = sign({
                    user: request.username,
                    hash: process.env.JWT_AUTH
                }, process.env.SECRET, { expiresIn: '1h' })
                res.send({token})
            }else{
                res.status(401).send()
            }
        }).catch(err => {
            console.log(err)
            res.status(401).send()
        })
})