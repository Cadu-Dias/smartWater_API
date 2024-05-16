import { Request, Response } from "express";
import { NodeAtributes, User, TableNodeField } from "./core/models/interface";
import express from 'express';
import dotenv from 'dotenv';
import { InfluxDB, flux } from '@influxdata/influxdb-client';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { ensureToken } from "./core/functions/middleware";
import { generateTableObject } from "./core/functions/function";

const db = require('./db/db.json')
const app = express()
dotenv.config({ path: './.env' }); 
app.use(express.json())
app.use(cors())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const port : string = process.env.PORT!;
const url : string = process.env.INFLUX_URL!
const token : string = process.env.TOKEN!
const bucket : string = process.env.BUCKET!
const org : string = process.env.ORGANIZATION!

const client = new InfluxDB({url: url, token: token})

app.post('/api/login', async (req: Request, res: Response) => {

    const { username, password } = req.body

    if(!username || !password) {
        return res.status(400).json({
            message: "The Username and Password are required!"
        })
    }

    const users : User[] = await db.users
        
    if(!users.find(user => user.username === username && user.password === password)) {
        return res.status(401).json({
            message: "This User is Unauthorized"
        })
    }

    const accessToken = jwt.sign({ "username": username }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "1h" })
    res.json({
        token: accessToken
    })
})

app.get("/api/smartlights",  /*ensureToken*/ async (req : Request, res : Response) =>  {
    /*jwt.verify(req.headers["authorization"]!, process.env.ACCESS_TOKEN_SECRET!, async (err, data) => {
        if(err) {
            return res.status(401).json({
                message: "This token does not exist!",
                error: err
            })
        }*/
        let interval = 60
        if(req.query.interval) interval = parseInt(req.query.interval as string) 

        let smartLightsByNode : NodeAtributes = {}
        const queryApi = client.getQueryApi(org);
    
        const query = flux`from(bucket: "${bucket}")
        |> range(start: -${interval}m) 
        |> filter(fn: (r) => r._measurement == "SmartLight")
        |> limit(n: 10)`
        console.log(query)
        const result : TableNodeField[] = await queryApi.collectRows(query);
        
        smartLightsByNode = generateTableObject(result)
        res.status(200)
        res.send(smartLightsByNode)
    //})
})

app.get("/api/watertanklevel", async (req : Request, res : Response) =>  {
    /*jwt.verify(req.headers["authorization"]!, process.env.ACCESS_TOKEN_SECRET!, async (err, data) => {
        if(err) {
            return res.status(401).json({
                message: "This token does not exist!",
                error: err
            })
        }*/
        let interval = 60
        if(req.query.interval) interval = parseInt(req.query.interval as string) 

        let waterTankLevelByNode : NodeAtributes = {}
        const queryApi = client.getQueryApi(org);
    
        const query = flux`from(bucket: "${bucket}")
        |> range(start: -${interval}m) 
        |> filter(fn: (r) => r._measurement == "WaterTankLavel")
        |> limit(n: 10)`
        const result : TableNodeField[] = await queryApi.collectRows(query);
        
        waterTankLevelByNode = generateTableObject(result)
        res.status(200)
        res.send(waterTankLevelByNode)
    //})
})

app.get("/api/hidrometer", /*ensureToken*/ async (req : Request, res : Response) =>  {

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

app.get("/api/artesianWell", /*ensureToken*/ async (req : Request, res : Response) =>  {

    /*jwt.verify(req.headers["authorization"]!, process.env.ACCESS_TOKEN_SECRET!, async (err, data) => {
        if(err) {
            return res.status(401).json({
                message: "This token does not exist!",
                error: err
            })
        }*/
        let interval = 60
        if(req.query.interval) interval = parseInt(req.query.interval as string) 

        let artesianByNode : NodeAtributes = {}
        const queryApi = client.getQueryApi(org);
    
        const query = flux`from(bucket: "${bucket}")
        |> range(start: -${interval}m) 
        |> filter(fn: (r) => r._measurement == "ArtesianWell")
        |> limit(n: 10)`
        const result : TableNodeField[] =  await queryApi.collectRows(query);
        
        artesianByNode = generateTableObject(result)
        res.status(200)
        res.send(artesianByNode)
    //})
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});