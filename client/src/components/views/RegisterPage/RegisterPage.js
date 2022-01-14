import { useNavigate } from 'react-router-dom';
import React from 'react'
import {useState} from 'react'
import { useDispatch } from 'react-redux';
import { registerUser} from '../../../_action/user_action';

function RegisterPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate(); 

    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const [Name, setName] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")

    const onEmailHandler =(event)=>{
        setEmail(event.target.value)
    }

    const onPasswordHandler =(event)=>{
        setPassword(event.target.value)
    }

    const onNameHandler =(event)=>{
        setName(event.target.value)
    }

    const onConfirmPasswordHandler =(event)=>{
        setConfirmPassword(event.target.value)
    }

    const onSubmitHandler = (event)=>{
        event.preventDefault();
        let body = {
            email: Email,
            password: Password,
            name:Name
        }

        if(Password !== ConfirmPassword){
            return alert('비밀번호롸 비밀번호 확인은 같아야합니다.')
        }
        
        dispatch(registerUser(body))
            .then(response => {
                if (response.payload.success) {
                    navigate('/')
                } else {
                    alert('Failed to sign up')
                }
            })
        
        }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
            , width: '100%', height: 'calc(100vh - 70px)'
        }}>
            <form style={{ display: 'flex', flexDirection: 'column' }}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Name</label>
                <input type="text" value={Name} onChange={onNameHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <label>Password confirm</label>
                <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />
                <br />
                <button type="submit">
                    회원가입
                </button>
            </form>
        </div>
    )
}

export default RegisterPage