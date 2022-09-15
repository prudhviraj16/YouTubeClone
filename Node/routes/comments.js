const mongoose = require('mongoose');
const verifyToken = require('../verifyToken');
const Comment = require('../models/Comment')
const Video = require('../models/Video')
const router = require("express").Router()

router.post("/",verifyToken,async(req,res)=>{
    const newComment = new Comment({...req.body,userId : req.user.id})
    
    try{
        const savedComment = await newComment.save()
        return res.status(200).json(savedComment)
    }
    catch(err){
        return res.status(400).json("Won't be able to add the comment")
    }
})

router.delete("/:id",verifyToken,async(req,res)=>{
    try{

        const comment = await Comment.findById(req.params.id)
        const video = await Video.findById(req.params.id)
    
        if(req.user.id===comment.userId || req.user.id === video.userId){
            await Comment.findByIdAndDelete(req.params.id)
    
            return res.status(200).json("The comment has been deleted")
        }
        else{
            return res.status(403).json("You can only delete your account")
        }
    }
    catch(err){
        return res.status(400).json("Not able to delete")
    }
})

router.get("/:videoId",async(req,res)=>{
    try{
        const comments = await Comment.find({videoId : req.params.videoId})

        res.status(200).json(comments)
    }
    catch(err){
         res.status(400).json("Please try again later")
    }
    
})

module.exports =  router