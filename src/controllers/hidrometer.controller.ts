import express, { Request, Response } from 'express'
import { NodeAtributes, TableNodeField } from '../core/models/interface'
import { generateTableObject } from "../core/functions/function";
import { client } from '..';
import { flux } from '@influxdata/influxdb-client';

const router = express.Router()
const bucket : string = process.env.BUCKET!
const org : string = process.env.ORGANIZATION!


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

        let hidrometerByNode : NodeAtributes = {}
        const queryApi = client.getQueryApi(org);
    
        const query = flux`from(bucket: "${bucket}")
        |> range(start: -${interval}m) 
        |> filter(fn: (r) => r._measurement == "Hidrometer")
        |> limit(n: 10)`
        const result : TableNodeField[] =  await queryApi.collectRows(query);
        
        hidrometerByNode = generateTableObject(result)
        res.status(200)
        res.send(hidrometerByNode)
    //})
})

module.exports = router