import axios from 'axios';
import React from 'react'
import { useParams } from "react-router";
import { useEffect, useState} from 'react'
import ProductImage from './Sections/ProductImage'
import ProductInfo from './Sections/ProductInfo'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container,Row, Col} from 'react-bootstrap';

function ProductDetailPage() {

    const {productId} = useParams();
    const [Product, setProduct] = useState({})

    useEffect(() => {
        axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
        .then(response => {
                setProduct(response.data[0])
        })
        .catch(err=>alert(err))
    }, [])

    return (
        <div style={{width:'100%', padding: '3rem 4rem'}}>
            <div style={{display:'flex', justifyContent:'center', marginBottom:'50px'}}>
                <h1>{Product.title}</h1>
            </div>
            <Container>
            <Row>
                <Col><ProductImage detail={Product}/></Col>
                <Col><ProductInfo detail={Product} productId={productId}/></Col>
            </Row>
            </Container>

            
            
        </div>
    )
}

export default ProductDetailPage
