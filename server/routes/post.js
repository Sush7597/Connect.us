const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const Post = mongoose.model("post")
const User = mongoose.model("user")
const requireLogin = require("../MiddleWare/requireLogin")

mongoose.set('useFindAndModify', false);

router.post('/createpost', requireLogin ,(req,res)=>{

    const {title , body, imageurl} = req.body

    if(!title || !body || !imageurl)
        return res.status(401).json({error : "All Fields are Compulsory."})
    
    const post = new Post({
        title,
        body,
        image : imageurl,
        postedBy: req.user
    })

    post.save().then(result=>{
        res.json({post : result})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get("/allpost", requireLogin, (req,res)=>{
    
    Post.find()
    .populate({ path: 'postedBy',select : "_id name", model: User })
    .populate({ path: 'comments.postedBy',select : "_id name", model: User })
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get("/getsubscribedposts", requireLogin, (req,res)=>{
    
    Post.find({postedBy : {$in : req.user.following}})
    .populate({ path: 'postedBy',select : "_id name", model: User })
    .populate({ path: 'comments.postedBy',select : "_id name", model: User })
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get("/mypost",requireLogin,(req,res)=>{
    Post.find({postedBy : req.user._id})
    .populate({ path: 'postedBy',select : "_id name", model: User })
    .populate({ path: 'comments.postedBy',select : "_id name", model: User })
    .then(myposts=>{
        res.json({myposts})
    }).catch(err=>{
        console.log(err)
    })
}) 

router.put("/like",requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push : {likes : req.user._id}
    },{
        new: true
    })
    .populate({ path: 'postedBy',select : "_id name", model: User })
    .populate({ path: 'comments.postedBy',select : "_id name", model: User })
    .exec((err,result)=>{
        if(err)
         return res.status(422).json({error : err})

        res.json(result)
    })
})
router.put("/dislike",requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull : {likes : req.user._id}
    },{
        new: true
    })
    .populate({ path: 'postedBy',select : "_id name", model: User })
    .populate({ path: 'comments.postedBy',select : "_id name", model: User })
    .exec((err,result)=>{
        if(err)
         return res.status(422).json({error : err})

        res.json(result)
    })
})

router.put("/comment",requireLogin,(req,res)=>{
    
    const comment = {
        text : req.body.text,
        postedBy : req.user
    }

    Post.findByIdAndUpdate(req.body.postId,{
        $push : {comments : comment}
    },{
        new: true
    })
    .populate({ path: 'comments.postedBy',select : "_id name", model: User })
    .populate({ path: 'postedBy',select : "_id name", model: User })
    .exec((err,result)=>{
        if(err)
         return res.status(422).json({error : err})

        res.json(result)
    })
})

router.put("/delete",requireLogin,(req,res)=>{

    Post.findByIdAndDelete(req.body.postId, (err,result)=>{
        if(err)
         return res.status(422).json({error : err})

        res.json(result)
    })
})

module.exports = router