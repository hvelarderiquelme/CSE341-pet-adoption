//Solves DNS issues
const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

//Requirements
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

//Libraries needed
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');


//Modular settings
const { connectDB } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/shelters", require("./routes/shelters"));


app.get('/', (req,res) => {
    res.status(200).json({
        status: "Success",
        message: "Welcome to the Pet Adoption API!",
        documentation: "Use http://localhost:8080/api-docs to access the documentation for this API." 
    })
});

//Start Server
async function startServer() {
    try {
        await connectDB();//wait for db to connect sucessfully
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log("Failed to connect to the database");
    }
};


startServer();