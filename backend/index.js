
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const PORT = 3000

app.use(bodyParser.json())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.use(require('./routes/route'))


app.listen(PORT, ()=>{
    console.log("app running at PORT: ", PORT)
})