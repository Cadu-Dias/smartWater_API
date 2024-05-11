import { Request, Response } from "express";
import { Hidrometer, HidrometerNodeField, SmartLight, SmartLightNodeField, WaterTank, WaterTankNodeField } from "./core/models/interface";
import express from 'express';
import dotenv from 'dotenv';
import { InfluxDB, flux } from '@influxdata/influxdb-client';
import cors from 'cors';

const app = express()

dotenv.config({ path: './.env' }); 
app.use(cors())

const port : string = process.env.PORT!;
const url : string = process.env.INFLUX_URL!
const token : string = process.env.TOKEN!
const bucket : string = process.env.BUCKET!
const org : string = process.env.ORGANIZATION!

const client = new InfluxDB({url: url, token: token})

app.get("/api/smartlights", async (req : Request, res : Response) =>  {
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
})

app.get("/api/watertanklevel", async (req : Request, res : Response) =>  {
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
})

app.get("/api/hidrometer", async (req : Request, res : Response) =>  {
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
})



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});