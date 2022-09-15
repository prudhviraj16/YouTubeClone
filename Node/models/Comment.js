// import mongoose from "mongoose";
const mongoose = require('mongoose')
const commentVideo = new mongoose.Schema({
    userId : {
        type :String,
        required : true
    },
    videoId : {
        type :String,
        required : true
    },
    desc : {
        type :String,
        required : true
    }
},
    {timestamps : true}
)

module.exports = mongoose.model("Comments",commentVideo)