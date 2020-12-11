import {Link, useHistory} from 'react-router-dom'
import {useContext} from 'react'
import {UserContext} from '../App'
const NavBar = ()=>{
    const {state, dispatch} = useContext(UserContext)
    const history = useHistory()

    const renderList = () => {
        if(state)
        {
            return [
                <li key = {"profile"}><Link to="/profile">Profile</Link></li>,
                <li key = {"createpost"}><Link to="/createPost">Create Post</Link></li>,
                <li key = {"followedpost"}><Link to="/followedpost">Followed Posts</Link></li>,
                <li key = {"logout"}>
                    <button className ="btn waves-effect waves-light #42a5f5 blue darken-1" onClick = {()=>{

                        localStorage.clear()
                        dispatch({type : "CLEAR"})
                        history.push("/signin")

                    }}>
                        Logout
                    </button>
                </li>
            ]
        }
        else
        {
            return [
                <li key = {"signin"}><Link to="/signin">Login</Link></li>,
                <li key = {"signup"}><Link to="/signup">Sign Up</Link></li>
            ]
        }
    }
    return(
        <nav>
            <div className="nav-wrapper white">
            <Link to= {state ? "/" : "signin"} className="brand-logo">Connect.us</Link>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
                {renderList()}
            </ul>
            </div>
        </nav>
    )
}

export default NavBar