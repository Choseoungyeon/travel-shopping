import { useNavigate } from 'react-router-dom';
import React from 'react'
import { Link } from "react-router-dom"
import {useState} from 'react'
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_action/user_action';

function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate(); 

    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    const onEmailHandler =(event)=>{
        setEmail(event.target.value)
    }

    const onPasswordHandler =(event)=>{
        setPassword(event.target.value)
    }

    const onSubmitHandler = (event)=>{
        event.preventDefault();
        let body = {
            email: Email,
            password: Password
        }
        
        dispatch(loginUser(body))
            .then(response => {
                if (response.payload.loginSuccess) {
                    navigate('/')
                } else {
                    alert('Error˝')
                }
            })
        
        }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
            , width: '100%', height: 'calc(100vh - 70px)', maxWidth:'500px', margin:'0 auto'
        }}>
            <form style={{ display: 'flex', flexDirection: 'column' }}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <p><Link to={"/register"}>register now</Link></p>
                <br />
                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    )
}

export default LoginPage
