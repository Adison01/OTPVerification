const express = require('express');
const connectDB = require('./config/db');

//Connect to MongoDB
connectDB();

const app = express();
app.use(express.json()); 

const PORT = 3000;
app.listen(PORT, ()=>{
    console.log(`Server on port ${PORT}`)
})