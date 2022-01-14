if(process.env.NODE_ENV === 'prduction') {
    module.exports =require('./prod')
}else{
    module.exports=require('./dev')
}