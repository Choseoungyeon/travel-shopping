const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const {User} = require("./models/User")
const {Product} = require('./models/Product')
const {auth} = require("./middleware/auth")
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require("path");

const confing = require("./config/key")


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
app.use(cookieParser())
app.use('/uploads', express.static('uploads'));
app.use(cors());

const mongoose = require("mongoose");
const connect = mongoose.connect(confing.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));
  
// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    res.send('hello worldfgggggg');
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
    image:req.user.image,
    cart:req.user.cart,
    history:req.user.history
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

  console.log(req.body)
})

app.post('/api/product/image', (req, res)=>{
  cloudinary.config({
    cloud_name: confing.cloudName,
    api_key: confing.apiKey,
    api_secret: confing.apiSecret
  });

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "MAIN",
    },
  });
  
  const upload = multer({ storage: storage }).array("file")

  upload(req, res, err =>{
    if(err) {
      return res.json({success: false, err})
    }
      return res.json({success:true, file:res.req.files})
  })
})

app.post('/api/product/modify_by_id', (req, res)=>{
  let type = req.query.type
  let productId = req.query.id

  Product.findOneAndUpdate(
    { _id: productId},
    { title:req.body.title,
      description:req.body.description,
      price:req.body.price,
      images:req.body.images,
      continents:req.body.continents},
    { new: true },
    (err, productinfo) => {
      if (err) return res.status(200).json({ success: false, err })
      res.status(200).send({success:true, productinfo})
    }
  )
})

app.post('/api/product/image/delete', (req, res) => {
  cloudinary.config({
    cloud_name: confing.cloudName,
    api_key: confing.apiKey,
    api_secret: confing.apiSecret
  });
  
  let deleteImg = req.body
  deleteImg.forEach((item) => {
    cloudinary.uploader.destroy(item.public_id, function(error,result) {
      console.log(result, error) });
  })
})

app.get('/api/product/delete_id', (req, res)=>{
  let productId = req.query.id

  Product.findOneAndDelete(
    { _id: productId},
    { new: true },
    (err) => {
      if (err) return res.status(200).json({ success: false, err })
      res.status(200).send({success:true})
    }
  )
})

app.post('/api/product/products',(req,res)=>{
  //product collection에 들어있는 모든 상품 정보를 가져오기
  let limit = req.body.limit ? parseInt(req.body.limit) : 20;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  let term = req.body.searchTerm 

  let findArg = {};

  for(let key in req.body.filters){
    if(req.body.filters[key].length > 0){

      // console.log('key', key)

      if(key === "price"){
        findArg[key] = {
          //Greater than equal
          $gte: req.body.filters[key][0],
          //Less than equal
          $lte: req.body.filters[key][1]
        }
      }else{
        findArg[key] =req.body.filters[key];
      } 
    }
  }

  // console.log('findArgs', findArg)

  if(term){
    Product.find(findArg)
    .find({ title: new RegExp(term)})
      .populate("writer")
      .skip(skip)
      .limit(limit)
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err })
        return res.status(200).json({ success: true, productInfo, postSize: productInfo.length })
      })
  } else {
    Product.find(findArg)
      .populate("writer")
      .skip(skip)
      .limit(limit)
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err })
        return res.status(200).json({ success: true, productInfo, postSize: productInfo.length })
      })
  }
})

app.get('/api/product/products_by_id', (req, res)=>{
  let type = req.query.type
  let productId = req.query.id

  if(type === "array"){
    //id=12321,1223321,233242이거를
    //productsId = ['12321','1223321','233242'] 이런식으로 바꿔주기
    let ids = req.query.id.split(',')
    productId = ids.map(item =>{
      return item
    })
  }

  Product.find({_id : {$in: productId}})
  .populate("writer")
  .exec((err,product) =>{
    if(err) return res.status(400).send(err)
    return res.status(200).send(product)
  })
})

app.post('/api/users/addToCart', auth, (req, res) => {
  // 먼저 User Collection에 해당 유저의 정보를 가져오기

  let duplicate = false;

  User.findOne({ _id: req.user._id },
    (err, userInfo) => {
      userInfo.cart.forEach((item) => {
        if (item.id === req.body.productId) {
          duplicate = true;
        }
      })

      //상품이 이미 있을때
      if (duplicate) {
        User.findOneAndUpdate(
          { _id: req.user._id, "cart.id": req.body.productId },
          { $inc: { "cart.$.quantity": 1 } },
          { new: true },
          (err, userInfo) => {
            if (err) return res.status(200).json({ success: false, err })
            res.status(200).send(userInfo.cart)
          }
        )
      } else {
        //상품이 이미 있지 않을때
        User.findOneAndUpdate(
          { _id: req.user._id },
          {
            $push: {
              cart: {
                id: req.body.productId,
                quantity: 1,
                date: Date.now()
              }
            }
          },
          { new: true },
          (err, userInfo) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).send(userInfo.cart)
          }
        )
      }

    })
  //가져온 정보에서 카트에다 넣으려하는 상품이 이미 들어있는지 확인


})

app.get('/api/users/removeCart', auth, (req, res) => {
  //먼저 cart안에 내가 지우려고 한 상품을 지워주기 
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      "$pull":
        { "cart": { "id": req.query.id } }
    },
    { new: true },
    (err, userInfo) => {
      let cart = userInfo.cart;
      let array = cart.map(item => {
        return item.id
      })
      // console.log(array)
      //product collection에서  현재 남아있는 상품들의 정보를 가져오기 

      //productIds = ['5e8961794be6d81ce2b94752', '5e8960d721e2ca1cb3e30de4'] 이런식으로 바꿔주기
      Product.find({ _id: { $in: array } })
        .populate('writer')
        .exec((err, productInfo) => {
          return res.status(200).json({
            productInfo,
            cart
          })
        })
    }
  )
})

// if (process.env.NODE_ENV === "production") {
//   //"client/build"는 react의 build파일 경로이다
//     app.use(express.static("client/build"));
  
//   //"..client"는 react 프로젝트의 파일 경로, "build"는 react프로젝트 내의 build폴더이다
//     app.get("*", (req, res) => {
//       res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
//     });
//   }

app.use(express.static(path.join(__dirname, "/client")));

app.get("*",(req, res) =>{
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })

