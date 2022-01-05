const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://choseungYeon:FF4eNd9EbsBLdzZ@boilerplate.eip1p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority').then(()=>console.log('MongoDB Connected....'))
  .catch(err => console.log(err))

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    res.send('hello world');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })