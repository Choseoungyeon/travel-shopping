import React, { useEffect, useState } from 'react'
import {useDispatch} from "react-redux"
import {getCartItems, removeCartItem} from "../../../_action/user_action"
import UserCartBlock from './Sections/UserCartBlock';

function CartPage(props) {
    const dispatch = useDispatch();

    const [Total, setTotal] = useState(0)
    const [ShowTotal, setShowTotal] = useState(false)

    useEffect(() => {

        let cartItems = []
        //리덕스 User state안에 cart 안에 상품이 들어있는지 확인 
        if (props.user.userData && props.user.userData.cart) {
            if (props.user.userData.cart.length > 0) {
                props.user.userData.cart.forEach(item => {
                    cartItems.push(item.id)
                })
                dispatch(getCartItems(cartItems, props.user.userData.cart))
                .then(response=>{calculateTotal(response.payload)})
            }
        }
    }, [props.user.userData])

    let calculateTotal = (cartDetail)=>{
        let total = 0;
        cartDetail.map(item => {
            total += parseInt(item.price, 10) * item.quantity
        })

        setTotal(total)
        setShowTotal(true)
    }

    let removeFromCart = (productId) =>{
        dispatch(removeCartItem(productId))
        .then(response=>{
            if(response.payload.productInfo.length <= 0){
                setShowTotal(false)
            }
        })
    }

    return (
        <div style={{width:'85%', margin:"3rem auto"}}>
            <h2>My Cart</h2>
            <UserCartBlock products={ props.user.cartDetail} removeItem={removeFromCart} />

            {ShowTotal ?
                <div style={{ marginTop: "3rem" }}>
                    <h2>Total Amount: ${Total}</h2>
                </div> : 
                <div style={{display:"flex", justifyContent:"center", marginTop:"60px", opacity:"0.2"}}>
                    <h3>no carts</h3>
                </div>
            }
            
        </div>
    )
}

export default CartPage
