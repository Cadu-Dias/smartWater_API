# SmartWater API

<p>This project is an API built using Node.js and Express.js, primarily coded in TypeScript. The API serves as a bridge to retrieve data from an InfluxDB Cloud database. 

The database stores data emitted by various sensors, making it a valuable resource for IoT (Internet of Things) applications. The API provides endpoints to query and access this sensor data, facilitating integration with other systems and applications.</p>

## Starting the Project
 Execute the following commands in order to run the API
 ```
  git clone https://github.com/Cadu-Dias/smartWater_API.git
  npm install
  npm run dev
 ```
 OBS: You have to create and configure a ".env" for the API work correctly. There is a ".env.example" containing the name of the environment variables that you need to create. Below there are the values that are being used to connect to the Database
 ```
INFLUX_URL=https://us-east-1-1.aws.cloud2.influxdata.com
TOKEN=YDD_QnWNZ6qAvD4n28K5nSTrI3XDD5S9Z6gXK5eFAIZk2eTyMFaEcMY3XC-ArkcgXi6mEqE7I42ghiE4tSjCaQ==
BUCKET=smartcampusmaua
ORGANIZATION=smartWater
PORT=3000
ACCESS_TOKEN_SECRET=smartWaterSecretAPIkey
 ``` 
## Current Routes
 
 These are the current routes that were made in the API, some changes might happen

    - /api/login (POST)
      - Needs to send a User object { username: string, password: string } in the Req Body

    - /api/smartlights (GET)
    - /api/watertanklevel (GET)
    - /api/hidrometer (GET)
    
    
