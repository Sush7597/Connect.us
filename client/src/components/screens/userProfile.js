import {useEffect,useState,useContext} from 'react'
import {UserContext} from "../../App"
import {useParams} from 'react-router-dom'
const {cloudinaryURL} = require("../../../keys")

const Profile = ()=>{

    const [userProfile, setProfile] = useState(null)
    const [showfollow, setShowfollow] = useState(true)
    const {state,dispatch} = useContext(UserContext)
    const {userid}= useParams()

    useEffect(()=>{
            fetch(`/user/${userid}`,{
                headers : {
                    "Authorization" : "Bearer " + localStorage.getItem("jwt")
                }
            })
            .then(res=>res.json())
            .then(result => {
                setProfile(result)
                if(result.user.followers.includes(state._id))
                setShowfollow(false)
            })
    },[userid,state])

    const follow = ()=>{
        fetch("/follow",{
            method : "put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                    followId : userid
                })
        })
        .then(res=>res.json())
        .then(data=>{
            dispatch({type : "UPDATE", payload: {following : data.following, followers: data.followers}})
            localStorage.setItem("user", JSON.stringify(data))
            setProfile((prevState)=>{
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers : [...prevState.user.followers,data._id]
                    }
                }
            })
            setShowfollow(false)
        })
    }

    const unfollow = ()=>{
        fetch("/unfollow",{
            method : "put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                    unfollowId : userid
                })
        })
        .then(res=>res.json())
        .then(data=>{
            dispatch({type : "UPDATE", payload: {following : data.following, followers: data.followers}})
            localStorage.setItem("user", JSON.stringify(data))
            setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item => item !== data._id)
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers : newFollower
                    }
                }
            })
            setShowfollow(true)
        })
    }

    return (
        <>
        {userProfile ? 
        <div style = {{maxWidth : "550px", margin : "0px auto"}}>
            <div style = {{
                display : "flex",
                justifyContent : "space-around",
                margin : "18px 0px",
                borderBottom : "1px solid grey"
            }}>
                <div>
                    <img  style = {{width : "160px", height : "160px", borderRadius : "80px"}}
                    alt = "Profile" 
                    src = {userProfile ? userProfile.user.image : cloudinaryURL + "<Default Image Path>"}
                    />
                </div>
                <div>
                    <h4>{userProfile ? userProfile.user.name : "Loading"}</h4>
                    <h5>{userProfile ? userProfile.user.email : "Loading"}</h5>
                    <div style = {{display : "flex", justifyContent : "space-between", width : "110%"}}>
                        <h6>{userProfile.posts.length} Posts</h6>
                        <h6>{userProfile.user.followers.length} Followers</h6>
                        <h6>{userProfile.user.following.length} Following</h6>
                    </div>
                    {
                        showfollow ? 
                        <button className ="btn waves-effect waves-light #42a5f5 blue darken-1"
                         style = {{margin : "10px"}}
                         onClick = {()=>follow()}>
                            Follow
                        </button>
                        :
                        <button className ="btn waves-effect waves-light #42a5f5 blue darken-1"
                        style = {{margin : "10px"}}
                        onClick = {()=>unfollow()}>
                            Unfollow
                        </button>
                    }
                </div>
            </div>
            <div className= "gallery">
                {
                    userProfile.posts.map(item=>{
                        return (
                            <img key = {item._id} className = "item" src = {item.image} alt = {item.title}/>
                            )
                    })
                }
            </div>
        </div>
        : <h2> Loading... </h2>}
        </>
    )
}

export default Profile