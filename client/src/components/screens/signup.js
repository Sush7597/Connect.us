import {Link,useHistory} from 'react-router-dom'
import {useState,useEffect} from 'react'
import M from 'materialize-css'
const {cloudinaryURL} = require("../../../keys")


const Signup = ()=>{
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)
    const history = useHistory()

    

    const postFields = ()=>{
        //eslint-disable-next-line
        const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if(!pattern.test(email))
        return M.toast({html: "Invalid Email!", classes:"#c62828 red darken-3"})

        fetch("/signup",{
            method : "post",
            headers : {"Content-Type": "application/json"},
            body : JSON.stringify({
                name,
                email,
                password,
                image : url
            })

        })
        .then(res=>res.json())
        .then(data => {
            if(data.error)
              return  M.toast({html: data.error, classes:"#c62828 red darken-3"})

                M.toast({html: "Signed up Successfully!", classes:"#43a047 green darken-1"})
                history.push("/signin")
            
        }).catch(err=>{
            console.log(err)
        })
    }

    useEffect(()=>{
        if(url)
        {
            postFields()
        }
    },[url, postFields])

    const PostData = ()=>{

        if(image)
        {
            postImage()
        }
        else
        {
            postFields()
        }        
    }
    
    const postImage = ()=>{

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
                
        })
        .catch(err=>{
            console.log(err)
        })   
    }

    return (
        <div className = "mycard">
            <div className ="card auth-card input-field">
                <h2> Connect.us </h2>
                <input 
                type = "text"
                placeholder = "Username"
                value = {name}
                onChange = {((e)=>setName(e.target.value))}
                />
                <input
                type = "text"
                placeholder = "Email"
                value = {email}
                onChange = {((e)=>setEmail(e.target.value))}
                />
                <input 
                type = "password"
                placeholder = "Password"
                value = {password}
                onChange = {((e)=>setPassword(e.target.value))}
                />
                <div className="file-field input-field">
                <div className="btn #42a5f5 blue darken-1">
                    <span>Upload Image</span>
                    <input type="file" onChange = {(e)=> setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
                </div>
                <button className ="btn waves-effect waves-light #42a5f5 blue darken-1" onClick = {()=>PostData()}>
                    Sign up
                </button>
                <h5>
                    <Link to="/signin">Already have an account?</Link>
                </h5>
            </div>
        </div>
    )
}

export default Signup