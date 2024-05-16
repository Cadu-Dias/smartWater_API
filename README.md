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
## API Documentation

  <p>For the project it was created a documentation by using the library <b><i>swagger-ui-express</i></b> that with a 'swagger.json' archive possibilitate a creation of a HTML Page with the routes, models, shcemes, etc.</p>

  <p>To access the API documentation you need to <b>RUN/START</b> the project and in a Navigator put the link http://localhost:3000/api/timeseries/v0.5/swagger/</p>

## Current Routes
 
 These are the current routes that were made in the API, some changes might happen

    - /api/timeseries/v0.5/login/user(POST)
      - Needs to send a User object { username: string, password: string } in the Req Body

    - /api/timeseries/v0.5/smartcampusmaua/SmartLights (GET)
      - /api/timeseries/v0.5/smartcampusmaua/SmartLights?interval=x  (GET)
      - x is in Minutes
  
    - /api/timeseries/v0.5/smartcampusmaua/WaterTanks (GET)
      - /api/timeseries/v0.5/smartcampusmaua/WaterTank?interval=x  (GET)
      - x is in Minutes
  
    - /api/timeseries/v0.5/smartcampusmaua/Hidrometers (GET)
      - /api/timeseries/v0.5/smartcampusmaua/Hidrometer?interval=x  (GET)
      - x is in Minutes
  
    - /api/timeseries/v0.5/smartcampusmaua/ArtesianWell
      - /api/timeseries/v0.5/smartcampusmaua/ArtesianWell?interval=x  (GET)
      - x is in Minutes    
    
