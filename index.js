const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const router = require("./Brands/Router")


const app = express()

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/',router)
app.get("/", function(req, res) {
  //when we get an http get request to the root/homepage
  res.send("Hello World");
});
app.listen(5000,()=>{
      console.log("App Listening on port 5000!!!")
})