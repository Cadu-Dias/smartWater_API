export interface SmartLight {
    [nodeName: string] :{
        [field: string] : {
            fieldValue: string | number,
            time: string,
            start: string,
            stop: string
        }[]}
}

export interface WaterTank {
    [nodeName: string] :{
        [field: string] : {
            fieldValue: string | number,
            time: string,
            start: string,
            stop: string
        }[]}
}

export interface Hidrometer {
    [nodeName: string] :{
        [field: string] : {
            fieldValue: string | number,
            time: string,
            start: string,
            stop: string
        }[]}
}
export interface SmartLightNodeField {
    result: string,
    table: number,
    _start: string,
    _stop: string,
    _time: string,
    _value: number | string,
    _field: string,
    _measurement: string,
    applicationID: string,
    applicationName: string,
    devEUI: string,
    fPort: string,
    host: string,
    nodeName: string,
    rxInfo_mac_0: string,
    rxInfo_mac_1: string,
    rxInfo_name_0: string,
    rxInfo_name_1: string,
    txInfo_adr: string,
    txInfo_codeRate: string,
    txInfo_dataRate_bandwidth: "125",
    txInfo_dataRate_modulation: "LORA"
}

export interface WaterTankNodeField {
    result: string,
    table: number,
    _start: string,
    _stop: string,
    _time: string,
    _value: number | string,
    _field: string,
    _measurement: string,
    applicationID: string,
    applicationName: string,
    devEUI: string,
    fPort: string,
    host: string,
    nodeName: string,
    rxInfo_mac_0: string,
    rxInfo_mac_1: string,
    rxInfo_name_0: string,
    rxInfo_name_1: string,
    txInfo_adr: string,
    txInfo_codeRate: string,
    txInfo_dataRate_bandwidth: "125",
    txInfo_dataRate_modulation: "LORA"
}

export interface HidrometerNodeField {
    result: string,
    table: number,
    _start: string,
    _stop: string,
    _time: string,
    _value: number | string,
    _field: string,
    _measurement: string,
    applicationID: string,
    applicationName: string,
    devEUI: string,
    fPort: string,
    host: string,
    nodeName: string,
    rxInfo_mac_0: string,
    rxInfo_mac_1: string,
    rxInfo_name_0: string,
    rxInfo_name_1: string,
    txInfo_adr: string,
    txInfo_codeRate: string,
    txInfo_dataRate_bandwidth: "125",
    txInfo_dataRate_modulation: "LORA"
}

export interface User {
    username: string
    password: string
}