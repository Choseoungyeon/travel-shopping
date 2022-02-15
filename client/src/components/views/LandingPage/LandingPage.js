import { useEffect, useState } from 'react'
import { Link }from "react-router-dom"
import axios from 'axios'
import React from 'react'
import Slider from 'react-slick'
import CheckBox from './Section/CheckBox'
import {continents, price} from './Section/Data'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './LandingPage.moduel.css'
import RadioBox from './Section/RadioBox'
import Search from './Section/Search'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col, Button} from 'react-bootstrap';

function LandingPage() {

    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0)
    const [Filters, setFilters] = useState([{
        continents : [],
        price: []
    }])
    const [SearchTerm, setSearchTerm] = useState("")

    const getProducts = (body) =>{
        axios.post('/api/product/products', body)
        .then(response=>{
            if(response.data.success){
                if(body.loadMore){
                    setProducts([...Products, ...response.data.productInfo])
                }else{
                    setProducts(response.data.productInfo)
                }
                setPostSize(response.data.postSize)
            }else{
                alert('상품들을 가져오는데 실패했습니다')
            }
        })
    }

    useEffect(()=>{
        let body ={
            skip:Skip,
            limit: Limit
        }
        getProducts(body)
    }, [])

    useEffect(() => {
        axios.get('/api/hello')
        .then(response => console.log(response.data))
    }, [])

    const loadMoreHandler =()=>{
        let changeSkip = Skip + Limit

        let body = {
            skip : changeSkip,
            limit : Limit,
            loadMore: true
        }

        getProducts(body)
        setSkip(Skip)
    }

    const settings = {
        dots: true,
        infinite: true,
      };

    const showFilteredResults = (filters) =>{
        let body = {
            skip:0,
            limit:Limit,
            filters:filters
        }

        getProducts(body)
        setSkip(0)
    }

    const handlePrice = (value)=>{
        const data = price;
        let array = [];

        for(let key in data) {
            if(data[key]._id === parseInt(value, 10)){
                array = data[key].array
            }
        }

        return array;
    }

    const handleFilters= (filters, cateogory)=>{
        const newFilters = {...Filters}

        newFilters[cateogory] = filters
        
        if(cateogory === "price"){
            let priceValue = handlePrice(filters)
            newFilters[cateogory] = priceValue
        }

        showFilteredResults(newFilters)
        setFilters(newFilters)
    }

    const updateSearchTerm = (newSearchTerm)=>{
        let body={
            skip:0,
            limit:Limit,
            filters:Filters,
            searchTerm : newSearchTerm
        }

        setSkip(0)
        setSearchTerm(newSearchTerm)
        getProducts(body)
    }


    return (
        <div className='Container' >
            <div>
                <h2>Let's go travel</h2>
            </div>

            {/* Filter */}
            <Container>
                <Row>
                    <Col><CheckBox list={continents} handleFilters={filters => handleFilters(filters, "continents")} /></Col>
                    <Col><RadioBox list={price} handleFilters={filters => handleFilters(filters,"price")}/></Col>
                </Row>
                <Row>
                    <Col md={{ span: 5, offset: 7 }}><Search refreshFunction ={updateSearchTerm}/></Col>
                </Row>
            </Container>
            <div className='CardContainer'>
                {Products.map((product, index) => (
                    <div className="Card" key={index}>
                        <div className='cardImage'>
                            <Slider {...settings}>
                                {product.images.map((productImage, index) => (
                                    <Link to={`/product/${product._id}`} key={index}>
                                        <div>
                                            <img src={productImage.path} />
                                        </div>
                                    </Link>
                                ))}
                            </Slider>
                        </div>
                        <h3>{product.title}</h3>
                        <p>${product.price}</p>
                    </div>
                ))}
            </div>
            {PostSize >= Limit &&
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', marginBottom: '50px' }}>
                    <Button onClick={loadMoreHandler} variant="outline-secondary">더보기</Button>
                </div>
            }
            
            

            {/* Search */}

        </div>
    )
}

export default LandingPage
