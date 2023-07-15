import {Router} from "express";
import { verify } from "jsonwebtoken";

type Token = {
    user: string,
    hash: string
}

export default Router().post('/validate', (req, res) => {
    const { token } = req.body
    
    if(!token){
        res.status(401).send()
    }
    
    try {
        const decoded = verify(token, process.env.SECRET) as Token
        if(decoded.hash === process.env.JWT_AUTH){
            res.status(200).send({ auth: true })
        }else{
            res.status(401).send()
        }
    } catch {
        res.status(401).send()
    }
})