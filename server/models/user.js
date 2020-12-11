const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    image : {
        type : String,
        default : "https://res.cloudinary.com/sush7597/image/upload/v1606964434/default_dgpizb.png"
    },
    password : {
        type : String,
        required : true
    },
    followers : [{
        type : ObjectId,
        ref : "User"
    }],
    following : [{
        type : ObjectId,
        ref : "User"
    }]
})

mongoose.model("user", userSchema)