const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username : { 
        type :String,
        unique : true
    },
    email : {
        type : String,
        unique : true
    },
    password : {
        type :String,
    },
    img : {
        type :String
    },
    subscribers : {
        type :Number,
        default : 0
    },
    subscribedUsers : {
        type : [String], 
    },
    fromGoogle : {
        type : Boolean,
        default : false
    }
},
    {timestamps : true}
)

module.exports = mongoose.model('users',UserSchema)