const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const Post = mongoose.model("post")
const User = mongoose.model("user")
const requireLogin = require("../MiddleWare/requireLogin")


router.get("/user/:id",requireLogin,(req,res)=>{

    User.findOne({_id : req.params.id})
    .select("-password")
    .then(user=>{
        Post.find({postedBy : req.params.id})
        .populate({ path: 'comments.postedBy',select : "_id name", model: User })
        .populate({ path: 'postedBy',select : "_id name", model: User })
        .exec((error,posts)=>{
            if(error)
                return res.status(422).json(error)

                res.json({user,posts})
        })
    })
    .catch(err=>{
        return res.status(404).json({error : "User not found."})
    })
})

router.put("/follow",requireLogin , (req,res)=>{

    User.findByIdAndUpdate(req.body.followId,{
        $push : {followers : req.user._id}
    },{
        new : true
    },(error,result)=>{
        if(error)
            return res.status(422).json({error});
        
        User.findByIdAndUpdate(req.user._id,{
            $push : {following : req.body.followId}
        },{
            new : true
        }).select("-password")
        .then(result=>{
            res.json(result)
        }).catch(error=>{
            res.status(422).json(error)
        })
    })
})

router.put("/unfollow", requireLogin ,(req,res)=>{

    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull : {followers : req.user._id}
    },{
        new : true
    },(error,result)=>{
        if(error)
            return res.status(422).json({error});
        
        User.findByIdAndUpdate(req.user._id,{
            $pull : {following : req.body.unfollowId}
        },{
            new : true
        }).select("-password")
        .then(result=>{
            res.json(result)
        }).catch(error=>{
            res.status(422).json(error)
        })
    })
})

router.put("/updateimage", requireLogin ,(req,res)=>{
    console.log(req.body)
    User.findByIdAndUpdate(req.user._id,{
        $set : {image : req.body.image}
    },{
        new : true

    },(error,result)=>{
        if(error)
            return res.status(422).json({error});

            res.json(result)
    })
})

module.exports = router