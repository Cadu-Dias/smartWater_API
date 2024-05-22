import express, { Request, Response } from 'express'
import { getAllNodes } from "../core/functions/function";

const router = express.Router()

router.get("/", /*ensureToken*/ async (req : Request, res : Response) =>  {

    /*jwt.verify(req.headers["authorization"]!, process.env.ACCESS_TOKEN_SECRET!, async (err, data) => {
        if(err) {
            return res.status(401).json({
                message: "This token does not exist!",
                error: err
            })
        }*/
        let interval = 60
        if(req.query.interval) interval = parseInt(req.query.interval as string) 

        let limit = 0
        if(req.query.interval) limit = parseInt(req.query.limit as string)
       
        const artesianByNode = getAllNodes('ArtesianWell', interval, limit)
        
        res.status(200)
        res.send(artesianByNode)
    //})
})

module.exports = router