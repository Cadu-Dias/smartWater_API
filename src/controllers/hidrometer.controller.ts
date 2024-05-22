import express, { Request, Response } from 'express'
import { getAllNodes, getByDeviceId, getByDeviceName } from "../core/functions/function";

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
       
        getAllNodes('Hidrometer', interval, limit).then((hidrometerObject) => {
            res.status(200)
            res.send(hidrometerObject)
        })
    //})
})

router.get("/deviceName/:nodeName", async (req : Request, res : Response) =>  {
    /*jwt.verify(req.headers["authorization"]!, process.env.ACCESS_TOKEN_SECRET!, async (err, data) => {
        if(err) {
            return res.status(401).json({
                message: "This token does not exist!",
                error: err
            })
        }*/
        const nodename = req.params.nodeName

        if(nodename) return res.status(400).json({ message: "You need to insert the Nodename in the route"})

        getByDeviceName('SmartLight', req.params.nodeName).then((hidrometerObject) => {
            if(!hidrometerObject[nodename]) {
                return res.send(404).json({ message: "There is not a value with name that you have passed" })
            }
            res.status(200)
            res.send(hidrometerObject)
        })
        
    //})
})

router.get("/deviceId/:devEUI", async (req : Request, res : Response) =>  {
    /*jwt.verify(req.headers["authorization"]!, process.env.ACCESS_TOKEN_SECRET!, async (err, data) => {
        if(err) {
            return res.status(401).json({
                message: "This token does not exist!",
                error: err
            })
        }*/

        const devEUI = req.params.devEUI

        if(devEUI) return res.status(400).json({ message: "You need to insert the Nodename in the route"})

        getByDeviceId('SmartLight', req.params.nodeName).then((hidrometerObject) => {
            if(!hidrometerObject[devEUI]) {
                return res.send(404).json({ message: "There is not a value with name that you have passed" })
            }
            res.status(200)
            res.send(hidrometerObject)
        })
        
    //})
})

module.exports = router