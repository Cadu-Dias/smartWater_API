import { Request, Response } from "express";
import { ArtesianWell, ArtesianWellNodeField, Hidrometer, HidrometerNodeField, SmartLight, SmartLightNodeField, User, WaterTank, WaterTankNodeField } from "./core/models/interface";
import express from 'express';
import dotenv from 'dotenv';
import { InfluxDB, flux } from '@influxdata/influxdb-client';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { ensureToken } from "./core/functions/functions";

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

        const smartLightsByNode : SmartLight = {}
        const queryApi = client.getQueryApi(org);
    
        const query = flux`from(bucket: "${bucket}")
        |> range(start: -1h) 
        |> filter(fn: (r) => r._measurement == "SmartLight")
        |> limit(n: 10)`
        const result : SmartLightNodeField[] = await queryApi.collectRows(query);
        result.map((smartLightNodeField) => {
            const smartlightsValue = {
                fieldValue: smartLightNodeField._value,
                time: smartLightNodeField._time,
                start: smartLightNodeField._start,
                stop: smartLightNodeField._stop
            }
            if(!smartLightsByNode[smartLightNodeField.nodeName]) {
                smartLightsByNode[smartLightNodeField.nodeName] = {}
            }
            if(!smartLightsByNode[smartLightNodeField.nodeName][smartLightNodeField._field]) {
                smartLightsByNode[smartLightNodeField.nodeName][smartLightNodeField._field] = [smartlightsValue]
            } else {
                smartLightsByNode[smartLightNodeField.nodeName][smartLightNodeField._field].push(smartlightsValue)
            }
        })
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
        const waterTankLevelByNode : WaterTank = {}
        const queryApi = client.getQueryApi(org);
    
        const query = flux`from(bucket: "${bucket}")
        |> range(start: -20m) 
        |> filter(fn: (r) => r._measurement == "WaterTankLavel")
        |> limit(n: 10)`
        const result : WaterTankNodeField[] = await queryApi.collectRows(query);
        result.map((waterTankNodeField) => {
            const waterTankValue = {
                fieldValue: waterTankNodeField._value,
                time: waterTankNodeField._time,
                start: waterTankNodeField._start,
                stop: waterTankNodeField._stop
            }
            if(!waterTankLevelByNode[waterTankNodeField.nodeName]) {
                waterTankLevelByNode[waterTankNodeField.nodeName] = {}
            }
            if(!waterTankLevelByNode[waterTankNodeField.nodeName][waterTankNodeField._field]) {
               
                waterTankLevelByNode[waterTankNodeField.nodeName][waterTankNodeField._field] = [waterTankValue]
            }else {
                waterTankLevelByNode[waterTankNodeField.nodeName][waterTankNodeField._field].push(waterTankValue)
            }
        })
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
        const hidrometerByNode : Hidrometer = {}
        const queryApi = client.getQueryApi(org);
    
        const query = flux`from(bucket: "${bucket}")
        |> range(start: -20m) 
        |> filter(fn: (r) => r._measurement == "Hidrometer")
        |> limit(n: 10)`
        const result : HidrometerNodeField[] =  await queryApi.collectRows(query);
        result.map((hidrometerNodeField) => {
            const hidrometerValue = {
                fieldValue: hidrometerNodeField._value,
                time: hidrometerNodeField._time,
                start: hidrometerNodeField._start,
                stop: hidrometerNodeField._stop
            }
            if(!hidrometerByNode[hidrometerNodeField.nodeName]) {
                hidrometerByNode[hidrometerNodeField.nodeName] = {}
            }
            if(!hidrometerByNode[hidrometerNodeField.nodeName][hidrometerNodeField._field]) {
                hidrometerByNode[hidrometerNodeField.nodeName][hidrometerNodeField._field] = [hidrometerValue]
            }
            else {
                hidrometerByNode[hidrometerNodeField.nodeName][hidrometerNodeField._field].push(hidrometerValue)
            }
        })
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
        const artesianByNode : ArtesianWell = {}
        const queryApi = client.getQueryApi(org);
    
        const query = flux`from(bucket: "${bucket}")
        |> range(start: -20m) 
        |> filter(fn: (r) => r._measurement == "Hidrometer")
        |> limit(n: 10)`
        const result : ArtesianWellNodeField[] =  await queryApi.collectRows(query);
        result.map((ArtesianWellNodeField) => {
            const artesianWellValue = {
                fieldValue: ArtesianWellNodeField._value,
                time: ArtesianWellNodeField._time,
                start: ArtesianWellNodeField._start,
                stop: ArtesianWellNodeField._stop
            }
            if(!artesianByNode[ArtesianWellNodeField.nodeName]) {
                artesianByNode[ArtesianWellNodeField.nodeName] = {}
            }
            if(!artesianByNode[ArtesianWellNodeField.nodeName][ArtesianWellNodeField._field]) {
                artesianByNode[ArtesianWellNodeField.nodeName][ArtesianWellNodeField._field] = [artesianWellValue]
            }
            else {
                artesianByNode[ArtesianWellNodeField.nodeName][ArtesianWellNodeField._field].push(artesianWellValue)
            }
        })
        res.status(200)
        res.send(artesianByNode)
    //})
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});