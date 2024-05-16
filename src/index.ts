import express from 'express';
import dotenv from 'dotenv';
import { InfluxDB } from '@influxdata/influxdb-client';
import cors from 'cors';


const app = express()
dotenv.config({ path: './.env' }); 
app.use(express.json())
app.use(cors())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const port : string = process.env.PORT || "4000";
const url : string = process.env.INFLUX_URL!
const token : string = process.env.TOKEN!

export const client = new InfluxDB({url: url, token: token})

const loginRoute = require('./controllers/login.controller')
const smartLightRoute = require('./controllers/smartlights.controller')
const waterTankRoute = require('./controllers/watertank.controller')
const hidrometerRoute = require('./controllers/hidrometer.controller')
const artesianWellRoute = require('./controllers/artesianwell.controller')


app.use('/api/login', loginRoute)

app.use('/api/smartlights', smartLightRoute)

app.use('/api/watertanklevel', waterTankRoute)

app.use('/api/hidrometer', hidrometerRoute)

app.use('/api/artesianwell', artesianWellRoute)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});