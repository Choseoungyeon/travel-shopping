import React from 'react'
import { useDispatch,  useSelector } from 'react-redux';
import { useEffect } from 'react';
import { auth } from '../_action/user_action'
import { useNavigate } from 'react-router-dom';

export default function Auth(SpecificComponent, option, adminRoute = null) {

    //option
    //null => 아무나 출입이 가능한 페이지
    //true => 로그인한 유저만 출입이 가능한 페이지
    //false => 로그인한 유저는 출입 불가능한 페이지

    function AuthenticationCheck(props) {

        let user = useSelector(state => state.user);
        const dispatch = useDispatch();
        const navigate = useNavigate(); 

        useEffect(() => {
            dispatch(auth()).then(response => {

                //로그인하지 않은 상태
                if(!response.payload.isAuth){
                    if(option){
                        navigate('/login')
                    }
                }else{
                    //로그인한 상태
                    if(adminRoute && !response.payload.isAdmin){
                        navigate('/')
                    }else{
                        if(option === false){
                            navigate('/')
                        }
                    }
                }
            })
        }, [dispatch, navigate])

        return(
            <SpecificComponent {...props} user={user}/>
        )
    }

    return AuthenticationCheck
}