const express = require("express")
const app = express()
const mongoose = require("mongoose")
const {mongoURI} = require("./keys")
const PORT = 5000

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true  })
mongoose.connection.on("connected",()=>{
    console.log("Database Connected.")
})
mongoose.connection.on("error",(err)=>{
    console.log("Database Connection Error : ", err)
})

var bodyParser = require('body-parser') 
app.use(bodyParser.json()) 

require("./models/post")
require("./models/user")
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

app.get("/", (req, res)=>{
        console.log("Home.")
    	res.send("Welcome to Connect.us!")
})


app.get("/about", (req, res)=>{
    console.log("About Page.")
    res.send("About Page.")
})

app.listen(PORT, ()=>{
    console.log("Connected to PORT : ", PORT)
})

