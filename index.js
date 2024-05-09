const express = require('express')
const cors = require('cors')

const { InfluxDB, flux } = require('@influxdata/influxdb-client')
const app = express()
app.use(cors())

const port = 3000;
const url = "https://us-east-1-1.aws.cloud2.influxdata.com"
const token = "p7OOpKDo-WgkJ1C21aLMLTdaw-_6GIe-1UtZLrc0fCeuhqz7OGRUxA5-TYGn9_9vk4gw86XfEMzHsxu-wqmUcw=="
const bucket = "smartcampusmaua"
const org = "802a670740d9e197"

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
        if(!teste[value._field]) {
            teste[value._field] = [value._value]
        }
        teste[value._field].push(value._value)
    })
    res.send(teste)
})

app.get("/api//watertanklevel", async (req, res) =>  {
    const teste = {}
    const queryApi = client.getQueryApi(org, bucket);

    const query = flux`from(bucket: "${bucket}")
    |> range(start: -1h) 
    |> filter(fn: (r) => r._measurement == "WaterTankLavel")
    |> limit(n: 10)`
    const result = await queryApi.collectRows(query);
    result.map((value) => {
        if(!teste[value._field]) {
            teste[value._field] = [value._value]
        }
        teste[value._field].push(value._value)
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
        if(!teste[value._field]) {
            teste[value._field] = [value._value]
        }
        teste[value._field].push(value._value)
    })
    res.send(teste)
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});