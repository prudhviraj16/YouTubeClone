const jwt = require('jsonwebtoken')
 const verifyToken = (req,res,next) => {
    
    const token = req.cookies.access_token

    console.log(token,"verifyToken")
    if(!token)
        return res.status(400).json("You are not authenticated")
        
    jwt.verify(token,"mysecretKey",(err,user)=>{
        if(err) return res.status(403).json('Invalid Token')
        req.user=user
        next()
    })
 }
module.exports = verifyToken

