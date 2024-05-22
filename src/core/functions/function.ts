import { flux } from "@influxdata/influxdb-client"
import { client } from "../.."
import { NodeAtributes, TableNodeField } from "../models/interface"

const bucket : string = process.env.BUCKET!
const org : string = process.env.ORGANIZATION!

export function generateTableObject(result :TableNodeField[]) {
    const tableByNode : NodeAtributes = {}
    result.map((nodeField) => {
        const fieldValue = {
            fieldValue: nodeField._value,
            timestamp: nodeField._time,
            start: nodeField._start,
            stop: nodeField._stop
        }
        if(!tableByNode[nodeField.nodeName]) {
            tableByNode[nodeField.nodeName] = {}
        }
        if(!tableByNode[nodeField.nodeName][nodeField._field]) {
            tableByNode[nodeField.nodeName][nodeField._field] = [fieldValue]
        } else {
            tableByNode[nodeField.nodeName][nodeField._field].push(fieldValue)
        }
    })

    return tableByNode
}

export async function getAllNodes(tableName: string, interval: number, limit: number) {

    const queryApi = client.getQueryApi(org);

    let query;
    if(limit <= 0) {
        query = flux`from(bucket: "${bucket}")
        |> range(start: -${interval}m) 
        |> filter(fn: (r) => r._measurement == "${tableName}")`
    } else {
        query = flux`from(bucket: "${bucket}")
        |> range(start: -${interval}m) 
        |> filter(fn: (r) => r._measurement == "${tableName}")
        |> limit(n: ${limit})`
    }

    const result : TableNodeField[] = await queryApi.collectRows(query);

    let nodeAtributes : NodeAtributes = generateTableObject(result)

    return nodeAtributes
}

export async function getByDeviceName(tableName: string, deviceName: string) {

    const queryApi = client.getQueryApi(org);
    
    const query = flux`from(bucket: "${bucket}")
        |> range(start: -15m) 
        |> filter(fn: (r) => r._measurement == "${tableName}" r.nodeName == "${deviceName}")`
    
    const result : TableNodeField[] = await queryApi.collectRows(query);
    
    let nodeAtributes : NodeAtributes = generateTableObject(result)
    
    return nodeAtributes
}

export async function getByDeviceId(tableName: string, deviceID: string) {

    const queryApi = client.getQueryApi(org);
    
    const query = flux`from(bucket: "${bucket}")
        |> range(start: -15m) 
        |> filter(fn: (r) => r._measurement == "${tableName}" r.nodeName == "${deviceID}")`
    
    const result : TableNodeField[] = await queryApi.collectRows(query);
    
    let nodeAtributes : NodeAtributes = generateTableObject(result)
    
    return nodeAtributes
}