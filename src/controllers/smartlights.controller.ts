import express, { Request, Response } from 'express'
import { getAllNodes, getByDeviceId, getByDeviceName } from "../core/functions/function";


const router = express.Router()

router.get("/",  /*ensureToken*/ async (req : Request, res : Response) =>  {
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
        if(req.query.limit) limit = parseInt(req.query.limit as string)
           
        getAllNodes('SmartLight', interval, limit).then((smartLightObject) => {
            res.status(200)
            res.send(smartLightObject)
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

        getByDeviceName('SmartLight', req.params.nodeName).then((smartLightObject) => {
            if(!smartLightObject[nodename]) {
                return res.send(404).json({ message: "There is not a value with name that you have passed" })
            }
            res.status(200)
            res.send(smartLightObject)
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

        if(devEUI) return res.status(400).json({ message: "You need to insert the devEUI in the route"})

        getByDeviceId('SmartLight', req.params.nodeName).then((smartLightObject) => {
            if(!smartLightObject[devEUI]) {
                return res.send(404).json({ message: "There is not a value with Id that you have passed" })
            }
            res.status(200)
            res.send(smartLightObject)
        })
        
    //})
})

module.exports = router