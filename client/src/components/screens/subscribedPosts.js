import {useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'

const Home = ()=>{

    const {state,dispatch} = useContext(UserContext)
    const [data,setData] = useState([])

    useEffect(()=>{
        fetch('/getsubscribedposts', {
            headers :{
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setData(result.posts)
        })
    },[])

    const likePost = (_id)=>{
        fetch("/like",{
            method : "put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                postId : _id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id===result._id)
                 return result
                else
                 return item
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const dislikePost = (_id)=>{
        fetch("/dislike",{
            method : "put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                postId : _id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id === result._id)
                 return result
                else
                 return item
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const comment = (text, postId)=>{
        fetch("/comment",{
            method : "put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                text,
                postId
            })
        }).then(res=> res.json())
        .then(result =>{

            const newData = data.map(item=>{
                if(item._id === result._id)
                 return result
                else
                 return item
            })
            setData(newData)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    
    return (
        <div className = "home">
            {
                data.map(item=>{

                    return(
                        <div className = "card home-card" key = {item._id}>
                            <Link to = {item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"}><h5 style = {{margin :" auto 10px"}}>{item.postedBy.name}</h5></Link>
                            <div className = "card-image">
                                <img 
                                src = {item.image}
                                alt = "Post"
                                />
                            </div>
                            <div className = "card-content">
                                {
                                item.likes.includes(state._id)
                                    ? <i className ="material-icons" onClick = {()=> dislikePost(item._id)}>thumb_down</i>
                                    : <i className ="material-icons" onClick = {()=> likePost(item._id)}>thumb_up</i>
                                }
                                <p>{item.likes.length} Likes</p>
                                <h6><b>{item.title}</b></h6>
                                <p>{item.body}</p>
                                <form onSubmit = {(e)=>{
                                    e.preventDefault()
                                    comment(e.target[0].value,item._id)
                                }}>
                                    <input
                                        type = "text"
                                        placeholder = "Comment"
                                    />
                                </form>
                                {
                                    item.comments.map(record=>{
                                        return(
                                        <h6 key = {record._id}><span style = {{fontWeight : "500"}}>{record.postedBy.name} : </span> {record.text}</h6>
                                        )
                                    })
                                }
                            </div>
                        </div>
        
                    )
                })
            }
            
        </div>
    )
}
export default Home