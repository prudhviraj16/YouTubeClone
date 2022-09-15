const jwt = require('jsonwebtoken');
const router = require("express").Router()
const userSchema = require('../models/User')
const bcrypt = require('bcrypt');
const verifyToken = require('../verifyToken');
const videoSchema = require('../models/Video')
const Cookies = require('universal-cookie');
router.post("/register", async (req, res) => {
  
    try {
      // console.log(req.body.username,req.body.email,req.body.password)
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt)
      //create new user
      const newUser = new userSchema({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });

      console.log(newUser)
      //save user and respond
      const user = await newUser.save();
      console.log(user)
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err)
    } 
})

router.get("/",async(req,res)=>{
  const users = "data"
  res.cookie("userData", users);
res.send('user data added to cookie');
})

router.post("/signin",async(req,res)=>{
  try {
    const userDb = await userSchema.findOne({ email: req.body.email });

    if(!userDb){
      return res.send({
          status : 404,
          message : "User not found"
      })
    }
    const validPassword = await bcrypt.compare(req.body.password, userDb.password)

    if(!validPassword){
      return res.send({
          status : 400,
          message : "Wrong Password"
      })
    }
    const token = jwt.sign({id:userDb._id},"mysecretKey")
    const {password,...others} = userDb._doc
    res.cookie("access_token",token);
    // res.cookie()
    res.status(200).json(others)
    } catch (err) {
    return res.send({
      status :500,
      message : err,
    })
  }
})



router.post("/google",async(req,res)=>{
  
  try {
    const user = await userSchema.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, "mysecretKey");
        res.cookie("access_token", token,{ httpOnly: true }).status(200).json(user._doc);
    } 
    
    else {
      const newUser = new userSchema({
        ...req.body,
        fromGoogle: true,
      });

      const savedUser = await newUser.save(); 
      const token = jwt.sign({ id: savedUser._id },"mysecretKey");
      res.cookie("access_token", token, { httpOnly: true }).status(200).json(savedUser._doc);
    }
  } 
  catch(err){
      res.status(400).json("Please try again")
  }
})


router.put("/:id",verifyToken,async(req,res)=>{
    if(req.params.id===req.user.id){
      try{
        const updatedUser = await userSchema.findByIdAndUpdate(req.params.id,{
          $set: req.body
        },
        {new : true }
        )

        res.status(200).json(updatedUser)
      }
      catch(err){
        res.status(500).json("You can only update your own account")
      }
    }
})


router.delete("/:id",verifyToken, async(req,res)=>{
  if(req.params.id===req.user.id){
    try{
      const user = await userSchema.findByIdAndDelete(req.params.id)
      res.status(200).json("User has been deleted")
    }
    catch(err){
      res.status(500).json("You can only delete your own account")
    }
  }
})


router.get("/find/:id",async(req,res)=>{
    try{
      const user = await userSchema.findById(req.params.id)
      res.status(200).json(user)
    }
    catch(err){
      res.status(400).json("Unable to find the user")
    }

})


router.put("/sub/:id",verifyToken,async(req,res)=>{
    try{
      await userSchema.findByIdAndUpdate(req.user.id,{
        $push : {
          subscribedUsers : req.params.id
        }
      })

      await userSchema.findByIdAndUpdate(req,params.id,{
        $inc : {subscribers : 1}
      })

      return res.status(200).json("Subscription Successful")
    }
    catch(err){
      return res.status(400).json("Unable to subscribe to another user")
    }
})


router.put("/unsub/:id",verifyToken,async(req,res)=>{
  try{
    await userSchema.findByIdAndUpdate(req.user.id,{
      $pull : {
        subscribedUsers : req.params.id
      }
    })

    await userSchema.findByIdAndUpdate(req,params.id,{
      $inc : {subscribers : -1}
    })

    res.status(200).json("Unsubscription Successful")
  }
  catch(err){
    res.status(400).json("Unable to subscribe ")
  }
})


router.put("/like/:videoId",verifyToken,async(req,res)=>{
  const id = req.user.id;
  const videoId = req.params.videoId;

  console.log(id,videoId)
  try {
    await videoSchema.findByIdAndUpdate(videoId,{
      $addToSet:{likes:id},
      $pull:{dislikes:id}
    })
    res.status(200).json("The video has been liked.")
  } 
  catch(err){
    res.status(400).json("Please try again")
  }
})


router.put("/dislike/:videoId",verifyToken,async(req,res)=>{
  const id = req.user.id;
    const videoId = req.params.videoId;
    try {
      await videoSchema.findByIdAndUpdate(videoId,{
        $addToSet:{dislikes:id},
        $pull:{likes:id}
      })
      res.status(200).json("The video has been disliked.")
  } 
  catch(err){
    res.status(400).json("Please try again")
  }
})


module.exports =  router