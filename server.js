//Solves DNS issues
const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

//Libraries needed
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const routers = require('./routes/pets');
const shelterRoutes = require("./routes/shelters");

//Modular settings
const { connectDB } = require('./config/db');
const { setupSwagger } = require('./config/swagger');

//Routes objects
const petRoutes = require('./routes/petRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

//const routes = require('./routes');

app.use(cors());
app.use(express.json());

//Initialize documentation modules
setupSwagger(app);

app.use(cors());
app.use(express.json());
app.use("/shelters", shelterRoutes);

//Application endpoint mappings
app.use('/pets', petRoutes);
app.use('/applications', applicationRoutes);

app.get('/', (req,res) => {
    res.status(200).json({
        status: "Success",
        message: "Welcome to the Pet Adoption API!",
        documentation: "type /api-docs after the root url to access the documentation for this API." 
    })
});

// 404 handler for unmatched routes
app.use((req, res) => {
    res.status(404).json({
        status: "Error",
        message: `Route ${req.originalUrl} not found`
    });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack || err);
    const status = err.status || 500;
    res.status(status).json({
        status: "Error",
        message: err.message || "Internal Server Error"
    });
});

//Start Server
async function startServer() {
    try {
        await connectDB();//wait for db to connect sucessfully
        app.listen(PORT, () => {
            console.log(`Server is running on port: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log("Failed to connect to the database");
    }
};

startServer();