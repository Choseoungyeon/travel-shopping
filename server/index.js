const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const {User} = require("./models/User")
const {Product} = require('./models/Product')
const {auth} = require("./middleware/auth")
const multer = require('multer');
const fs = require('fs').promises;

const confing = require("./config/dev")


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
app.use(cookieParser())
app.use('/uploads', express.static('uploads'));

const mongoose = require('mongoose')
mongoose.connect(confing.mongoURI).then(()=>console.log('MongoDB Connected....'))
  .catch(err => console.log(err))

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    res.send('hello world');
});

app.get('/api/hello', (req,res) =>{
  res.send("안녕하세요!")
})

app.post('/api/users/register',(req,res) =>{
  const user = new User(req.body)
  user.save((err, userInfo) => {
    if(err) return res.json({success:false, err})
    return res.status(200).json({
      success:true
    })
  })
})

app.post('/api/users/login',(req,res)=>{
  //요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({email:req.body.email},(err, user)=>{
    if(!user){
      return res.json({
        loginSuccess:false,
        message:"제공된 이메일에 해당하는 유저가 없습니다"
      })
    }

    //요청한 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다" })
    })
    //비밀번호까지 맞다면 토큰을 생성하기.
    user.generateToken((err, user) => {
      if(err) return res.status(400).send(err);

      //토큰을 저장한다. 어디에? 쿠키, 로컬스토리지
      res.cookie("x_auth", user.token)
      .status(200)
      .json({loginSuccess:true, userId: user._id})
    })
  })
})

//role 0 => 일반유저 role 0이 아니면 관리자
app.get('/api/users/auth', auth, (req,res)=>{
  //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True 라는 말.
  res.status(200).json({
    _id:req.user._id,
    isAdmin: req.user.roll === 0 ? false : true,
    isAuth:true,
    email:req.user.email,
    name:req.user.name,
    lastname:req.user.lastname,
    role:req.user.role,
    image:req.user.image
  })
})

app.get('/api/users/logout', auth, (req, res)=>{
  User.findOneAndUpdate({_id:req.user._id}, 
    {token:""},
    (err, user) => {
      if(err) return res.json({success:false, err})
      return res.status(200).send({
        success:true
      })
    })
})

app.post('/api/product', (req, res)=>{
  //받아온 정보들을 DB에 넣어준다
  const product = new Product(req.body)
  product.save((err)=>{
    if(err) return res.status(400).json({success:false, err})
    return res.status(200).json({success:true})
  })
})

app.post('/api/product/image', (req, res)=>{
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null,`${Date.now()}_${file.originalname}`)
    }
  })
  
  const upload = multer({ storage: storage }).single("file")

  //가져온 이미지를 저장을 해주면 된다.
  upload(req, res, err =>{
    if(err) {
      return res.json({success: false, err})
    }

    return res.json({success:true, filePath:res.req.file.destination, file:res.req.file.filename})
  })
})

app.post('/api/product/image/delete', (req, res)=>{
  const test = req.body.imageName
  fs.readdir('./uploads')
  .then((dir)=>{
    console.log('폴더내용확인', dir)
    return fs.unlink(`./${test}`)
  })
})

app.post('/api/product/products',(req,res)=>{
  //product collection에 들어있는 모든 상품 정보를 가져오기
  let limit = req.body.limit ? parseInt(req.body.limit) : 20;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  Product.find()
  .populate("writer")
  .skip(skip)
  .limit(limit)
  .exec((err, productInfo) => {
    if(err) return res.status(400).json({success:false, err})
    return res.status(200).json({success:true, productInfo, postSize:productInfo.length})
  })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })