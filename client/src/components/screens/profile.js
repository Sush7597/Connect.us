import {useEffect,useState,useContext} from 'react'
import {UserContext} from "../../App"
const {cloudinaryURL} = require("../../../keys")

const Profile = ()=>{

    const [mypics, setMypics] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)

    useEffect(()=>{
            fetch("/mypost",{
                headers : {
                    "Authorization" : "Bearer " + localStorage.getItem("jwt")
                }
            })
            .then(res=>res.json())
            .then(result => {
                setMypics(result.myposts)
            })
    },[])

    useEffect(()=>{
        if(image)
        {
            const data = new FormData()
            data.append("file", image)
            data.append("upload_preset","project")
            data.append("cloud_name","sush7597")

            fetch(cloudinaryURL,{
                method : "post",
                body : data
            })
            .then(res => res.json())
            .then(data=>{
                setUrl(data.secure_url)
                fetch("/updateimage",{
                    method : "put",
                    headers : {
                        "Content-Type" : "application/json",
                        "Authorization" : "Bearer " + localStorage.getItem("jwt")
                    },
                    body : JSON.stringify({
                        image : data.secure_url
                    })
                }).then(res=>res.json())
                .then(result=>{
                    console.log(result)
                    localStorage.setItem("user",JSON.stringify({...state, image : result.image}))
                    dispatch({type : "UPDATEPIC", payload : result.image})
                })
            })
            .catch(err=>{
                console.log(err)
            })  
        }

    },[image])

    const postImage = (file)=>{
        setImage(file.target.files[0])
    }


    return (
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
                    src = {state ? state.image : cloudinaryURL + "<Default Image Path>"}
                    />

                    <div className="file-field input-field" style = {{margin : "10px", display : "flex", justifyContent : "space-around"}}>
                    <div className="btn #42a5f5 blue darken-1">
                        <span>Update Image</span>
                        <input type="file" onChange = {(e)=> postImage(e)} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                    </div>
                </div>
                <div>
                    <h4>{state ? state.name : "Loading"}</h4>
                    <h5>{state ? state.email : "Loading"}</h5>
                    <div style = {{display : "flex", justifyContent : "space-between", width : "110%"}}>
                        <h6>{mypics.length} Posts</h6>
                        <h6>{state ? state.followers.length : "Loading"} Followers</h6>
                        <h6>{state ? state.following.length : "Loading"} Following</h6>
                    </div>
                </div>
            
            </div>
            <div className= "gallery">
                {
                    mypics.map(item=>{
                        return (
                            <img key = {item._id} className = "item" src = {item.image} alt = {item.title}/>
                            )
                    })
                }
            </div>
        </div>
    )
}

export default Profile