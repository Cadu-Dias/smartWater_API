import { Request, Response } from "express";
import { Hidrometer, SmartLight, WaterTank } from "./core/models/interface";
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
    const smartLightsByNode : {[key: string] : {[key: string] : (number | string)[]} }= {}
    const queryApi = client.getQueryApi(org);

    const query = flux`from(bucket: "${bucket}")
    |> range(start: -1h) 
    |> filter(fn: (r) => r._measurement == "SmartLight")
    |> limit(n: 10)`
    const result : SmartLight[] = await queryApi.collectRows(query);
    result.map((value) => {
        if(!smartLightsByNode[value.nodeName]) {
            smartLightsByNode[value.nodeName] = {}
        }
        if(!smartLightsByNode[value.nodeName][value._field]) {
            smartLightsByNode[value.nodeName][value._field] = [value._value]
        }
        smartLightsByNode[value.nodeName][value._field].push(value._value)
    })
    res.send(smartLightsByNode)
})

app.get("/api/watertanklevel", async (req : Request, res : Response) =>  {
    const waterTankLevelByNode : {[key: string] : {[key: string] : (number | string)[]} } = {}
    const queryApi = client.getQueryApi(org);

    const query = flux`from(bucket: "${bucket}")
    |> range(start: -1h) 
    |> filter(fn: (r) => r._measurement == "WaterTankLavel")
    |> limit(n: 10)`
    const result : WaterTank[] = await queryApi.collectRows(query);
    result.map((value) => {
        if(!waterTankLevelByNode[value.nodeName]) {
            waterTankLevelByNode[value.nodeName] = {}
        }
        if(!waterTankLevelByNode[value.nodeName][value._field]) {
            waterTankLevelByNode[value.nodeName][value._field] = [value._value]
        }
        waterTankLevelByNode[value.nodeName][value._field].push(value._value)
    })
    res.send(waterTankLevelByNode)
})

app.get("/api/hidrometer", async (req : Request, res : Response) =>  {
    const hidrometerByNode : {[key: string] : {[key: string] : (number | string)[]} } = {}
    const queryApi = client.getQueryApi(org);

    const query = flux`from(bucket: "${bucket}")
    |> range(start: -1h) 
    |> filter(fn: (r) => r._measurement == "Hidrometer")`
    const result : Hidrometer[] =  await queryApi.collectRows(query);
    result.map((value) => {
        if(!hidrometerByNode[value.nodeName]) {
            hidrometerByNode[value.nodeName] = {}
        }
        if(!hidrometerByNode[value.nodeName][value._field]) {
            hidrometerByNode[value.nodeName][value._field] = [value._value]
        }
        hidrometerByNode[value.nodeName][value._field].push(value._value)
    })

    res.send(hidrometerByNode)
})



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});