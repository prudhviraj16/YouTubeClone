const Video = require("../models/Video")
const verifyToken = require("../verifyToken")
const userSchema = require('../models/User')

const router = require("express").Router()

router.post("/",verifyToken,async(req,res)=>{
    const newVideo = new Video({userId : req.user.id,...req.body})

    try{    
        const savedVideo = await newVideo.save()
        res.status(200).json(savedVideo)
    }

    catch(err){
        res.status(400).json("Please try again")
    }
})

router.put("/:id",verifyToken,async(req,res)=>{
    const video = await Video.findById(req.params.id)

    if(!video) return res.status(404).json("Video not found")

    if(req.user.id==video.userId){
        const updatedUser = await Video.findByIdAndUpdate(req.params.id,{
            $set : req.body
        },{new : true})
        res.status(200).json(updatedUser)
    }else{
        return res.status(403).json("You can update only your videos")
    }

})

router.delete("/:id",verifyToken,async(req,res)=>{
    const video = await Video.findById(req.params.id)

    if(!video) return res.status(404).json("Video not found")

    if(req.user.id==video.userId){
        await Video.findByIdAndDelete(req.params.id)
        res.status(200).json("Video has been deleted")
    }else{
        return res.status(403).json("You can delete only your videos")
    }
})

router.get("/find/:id",async(req,res)=>{
    try{
        const video = await Video.findById(req.params.id)
        res.status(200).json(video)
    }
    catch(err){
        res.status(400).json("Please try again")
    }
})

router.put("/view/:id",async(req,res)=>{
    try{
        await Video.findByIdAndUpdate(req.params.id,{
            $inc : {views :1}
        })

        res.status(200).json("The view has been increased.")
    }
    catch(err){
        res.status(400).json("Please try again later")
    }
})

router.get("/trend",async(req,res)=>{
    try{
        const videos = await Video.find().sort({views : -1})
        res.status(200).json(videos)
    }
    catch(err){
        res.status(400).json("Please try again later")
    }
})

router.get("/random",async(req,res)=>{
    try{
        const videos = await Video.aggregate([{$sample : { size :40 }}])
        res.status(200).json(videos)
    }
    catch(err){
        res.status(400).json("Please try again later")
    }
})

router.get("/sub",verifyToken,async(req,res)=>{

    try{
        const user = await userSchema.findById(req.user.id)

        const subscribedChannels = user.subscribedUsers

        const list = await Promise.all(
            subscribedChannels.map((channelId)=>{
                return Video.find({userId:channelId})
            })
        )

        res.status(200).json(list.flat().sort((a,b)=>b.createdAt - a.createdAt))
    }
    catch(err){
        res.status(400).json("Please try again later")
    }
})

router.get("/tags",async(req,res)=>{
    const tags = req.query.tags.split(",")

    try{
        const videos = await Video.find({tags : { $in : tags }}).limit(20)

        res.status(200).json(videos)
    }
    catch(err){
        res.status(400).json("Please try again later")
    }
})

router.get("/search",async(req,res)=>{
    const query  = req.query.q

    try{
        const videos = await Video.find({title : {$regex : query, $options : "i"}}).limit(40)

        res.status(200).json(videos)
    }
    catch(err){
        res.status(400).json("Please try again later")
    }
})

module.exports =  router 