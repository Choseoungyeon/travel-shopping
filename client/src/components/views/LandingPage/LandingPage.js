import { useEffect, useState } from 'react'
import axios from 'axios'
import React from 'react'
import Slider from 'react-slick'
import CheckBox from './Section/CheckBox'
import {continets} from './Section/Data'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './LandingPage.moduel.css'


function LandingPage() {

    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0)

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


    return (
        <div className='Container' >
            <div>
                <h2>Let's go travel</h2>
            </div>

            {/* Filter */}
            <CheckBox list={continets} />

            <div className='CardContainer'>
                {Products.map((product, index) => (
                    <div className="Card" key={index}>
                        <div className='cardImage'>
                            <Slider {...settings}>
                                {product.images.map((productImage, index) => (
                                    <div key={index}>
                                        <img src={`http://localhost:5000/${productImage}`} />
                                    </div>
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
                    <button onClick={loadMoreHandler}>더보기</button>
                </div>
            }
            
            

            {/* Search */}

        </div>
    )
}

export default LandingPage
