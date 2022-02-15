import React, {useEffect, useState} from 'react'
import { Link } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Table} from 'react-bootstrap';
import {useDispatch} from 'react-redux'
import { useSelector } from "react-redux";
import {addToCart} from '../../../../_action/user_action'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProductInfo(props) {

    const [Product, setProduct] = useState({})
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const user = useSelector(state => state.user) 

    useEffect(() => {

        setProduct(props.detail)
        
    }, [props.detail])

    const clickHandler = ()=>{
        dispatch(addToCart(props.detail._id))
        navigate('/')
    }

    const deleteHandler = ()=>{
        alert('정말로 삭제하겠습니까?')
        if(Product.images.length > 0){
            axios.post('/api/product/image/delete', Product.images)
        }
        axios.get(`/api/product/delete_id?id=${props.productId}&type=single`)
        .then(response => {
            if(response.data.success){
                console.log("success delete!")
                navigate('/')
            }
        })
    }

    return (
        <div>
            <Table bordered>
                <thead>
                    <tr>
                        <th>Price:{Product.price}</th>
                        <th>Sold:{Product.sold}</th>
                        <th>Views:{Product.views}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan={3} style={{lineHeight:"1.3rem", fontWeight:"normal"}}>Description:{Product.description}</td>
                    </tr>
                </tbody>
            </Table>

            <div style={{display:'flex', justifyContent:'center'}}>
                <Button onClick={clickHandler} variant="outline-secondary">
                    Add to Cart
                </Button>
                {user.userData._id === props.detail._id ?
                    null
                    : <div className='modifiedSec'>
                    <Link to={`/product/modified/${Product._id}`}>
                        <Button variant="outline-secondary">수정하기</Button>
                    </Link>
                    <Button onClick={deleteHandler} variant="outline-secondary">삭제하기</Button>
                </div>}
                
            </div>
        </div>
            
    )
}

export default ProductInfo
