const jwt = require("jsonwebtoken")
const {JWT_Secret} = require("../keys")
const mongoose = require("mongoose")
const User = mongoose.model("user")

module.exports = (req,res,next)=>{

    const {authorization} = req.headers

    if(!authorization)
        return res.status(401).json({error : "User must be Logged In."})

    const token = authorization.replace("Bearer ", "");

    jwt.verify(token, JWT_Secret, (err,payload)=>{        
        if(err)
        {
            return res.status(401).json({error : "User must be Logged In."})
        }
        else
        {
            const {_id} = payload
            User.findById(_id).then(userdata=>{
                req.user = userdata
                next()
            })
        }
    })
}