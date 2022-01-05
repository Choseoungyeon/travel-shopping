const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const {User} = require("./models/User")

const confing = require("./config/dev")


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())

const mongoose = require('mongoose')
mongoose.connect(confing.mongoURI).then(()=>console.log('MongoDB Connected....'))
  .catch(err => console.log(err))

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    res.send('hello world');
});

app.post('/register',(req,res) =>{
  const user = new User(req.body)

  user.save((err, userInfo) => {
    if(err) return res.json({success:false, err})
    return res.status(200).json({
      success:true
    })
  })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })