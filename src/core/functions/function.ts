import { NodeAtributes, TableNodeField } from "../models/interface"

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