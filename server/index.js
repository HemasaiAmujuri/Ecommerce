const express = require("express")
const app = express()
const db = require('./src/config/db')
const cors = require("cors");
const routers = require("./src/routes/router")


const PORT = 5000;

app.use(cors())
app.use(express.json())


app.use("/api", routers);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});