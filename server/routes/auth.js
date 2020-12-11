const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const User = mongoose.model("user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {JWT_Secret} = require("../keys")
const requireLogin = require("../MiddleWare/requireLogin")

router.get("/", (req,res)=>{
    res.send("Welcome to Auth!")
})

router.post("/signup", (req,res)=>{
    
    const {name, email, password, image} = req.body;

    if(!email || !password || !name){
       return res.status(422).json({error : "All Fields are required!"})
    }
    User.findOne({email : email}).then((savedUser)=>{
        if(savedUser)
        return res.status(422).json({error : "E-mail ID Already Exists."})

        bcrypt.hash(password, 10)
        .then(hashedpass=>{
            const user = new User({
                name,
                email,
                password:hashedpass,
                image : image
            })
    
            user.save().then(user=>{
                res.json({message : "Signup successful."})
            }).catch(err=>{
                console.log(err)
            })
        })
        

    }).catch(err=>{
        console.log(err)
    })
})

router.post("/signin",(req,res)=>{

    const {email, password} = req.body

    if(!email || !password)  {
        return res.status(422).json({error : "Enter valid Email and Password."})
    }

    User.findOne({email : email})
    .then(savedUser=>{
        if(!savedUser)
        return res.status(422).json({error : "Enter valid Email and Password."})

        bcrypt.compare(password, savedUser.password)
        .then(match=>{
            if(!match)
            return res.status(422).json({error : "Enter valid Email and Password."})

            const token = jwt.sign({_id : savedUser._id}, JWT_Secret)
            const {_id,name,email,followers,following, image} = savedUser
            const user = JSON.stringify({_id, name, email,followers,following, image})
            res.json({message : "Signin Successful.", token, user})

        }).catch(err =>{
            console.log(err)
        })
    })

})

router.get("/protected", requireLogin ,(req,res)=>{
    res.send("Protected!")
})

module.exports = router