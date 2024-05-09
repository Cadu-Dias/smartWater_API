const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config({ path: './.env' }); 

const { InfluxDB, flux } = require('@influxdata/influxdb-client')
const app = express()
app.use(cors())

const port = process.env.PORT;
const url = process.env.INFLUX_URL
const token = process.env.TOKEN
const bucket = process.env.BUCKET
const org = process.env.ORGANIZATION

const client = new InfluxDB({url: url, token: token})

app.get("/api/smartlights", async (req, res) =>  {
    const teste = {}
    const queryApi = client.getQueryApi(org);

    const query = flux`from(bucket: "${bucket}")
    |> range(start: -1h) 
    |> filter(fn: (r) => r._measurement == "SmartLight")
    |> limit(n: 10)`
    const result = await queryApi.collectRows(query);
    result.map((value) => {
        if(!teste[value.nodeName]) {
            teste[value.nodeName] = {}
        }
        if(!teste[value.nodeName][value._field]) {
            teste[value.nodeName][value._field] = [value._value]
        }
        teste[value.nodeName][value._field].push(value._value)
    })
    res.send(teste)
})

app.get("/api/watertanklevel", async (req, res) =>  {
    const teste = {}
    const queryApi = client.getQueryApi(org, bucket);

    const query = flux`from(bucket: "${bucket}")
    |> range(start: -1h) 
    |> filter(fn: (r) => r._measurement == "WaterTankLavel")
    |> limit(n: 10)`
    const result = await queryApi.collectRows(query);
    result.map((value) => {
        if(!teste[value.nodeName]) {
            teste[value.nodeName] = {}
        }
        if(!teste[value.nodeName][value._field]) {
            teste[value.nodeName][value._field] = [value._value]
        }
        teste[value.nodeName][value._field].push(value._value)
    })
    res.send(teste)
})

app.get("/api/hidrometer", async (req, res) =>  {
    const teste = {}
    const queryApi = client.getQueryApi(org);

    const query = flux`from(bucket: "${bucket}")
    |> range(start: -1h) 
    |> filter(fn: (r) => r._measurement == "Hidrometer")`
    const result =  await queryApi.collectRows(query);
    result.map((value) => {
        if(!teste[value.nodeName]) {
            teste[value.nodeName] = {}
        }
        if(!teste[value.nodeName][value._field]) {
            teste[value.nodeName][value._field] = [value._value]
        }
        teste[value.nodeName][value._field].push(value._value)
    })
    res.send(teste)
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});