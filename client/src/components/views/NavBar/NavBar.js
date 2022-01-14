import React from 'react'
import { Link } from "react-router-dom"
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import "./NavBar.moduel.css"
import axios from 'axios';


function NavBar() {
    const navigate = useNavigate(); 
    const user = useSelector(state => state.user)
    console.log(user)

    const onClickHandler = ()=>{
        axios.get('/api/users/logout')
        .then(response => {
            if(response.data.success){
                navigate('/login')
            }else{
                alert('로그아웃 하는데 실패 했습니다')
            }
        })
    }
    
    return (
        <div className='NavContainer'>
            <div className='NavLeft'>
                <h1><Link to={"/"} >Home</Link></h1>
            </div>
            <div className='NavRight'>
                {user.userData && !user.userData.isAuth ? 
                    <ul>
                        <li>
                            <Link to={"/login"} >sign in</Link>
                        </li>
                        <li>
                            <Link to={"/register"} >sign up</Link>
                        </li>
                    </ul> :
                    <ul>
                        <li onClick={onClickHandler}>logout</li>
                        <li>
                            <Link to={"/product/upload"} >upload</Link>
                        </li>
                    </ul>
                }
            </div>
        </div>
    )
}

export default NavBar
