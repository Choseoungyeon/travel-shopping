import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react'
import FileUploadModify from './Section/FileUploadModify';
import {Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'

const Continents =[
    {key:1, value:"Africa"},
    {key:2, value:"Europe"},
    {key:3, value:"Asia"},
    {key:4, value:"North America"},
    {key:5, value:"South America"},
    {key:6, value:"Australia"},
    {key:7, value:"Antarctica"},
]

function ProductModifyPage(props) {
    const navigate = useNavigate(); 
    const {productId} = useParams();

    const [Product, setProduct] = useState({})

    const [Title, setTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Price, setPrice] = useState(0)
    const [Continent, setContinent] = useState(1)
    const [Files, setFiles] = useState([]);
    const [RemoveImg, setRemoveImg] = useState([]);
    const [ProductImg, setProductImg] = useState([]);

    const titleChangeHandler =(event)=>{
        setTitle(event.target.value)
    }
    
    const DescriptionChangeHandler =(event)=>{
        setDescription(event.target.value)
    }

    const PriceChangeHandler =(event)=>{
        setPrice(event.target.value)
    }

    const ContinentChangeHandler =(event)=>{
        setContinent(event.target.value)
    }

    const updateFiles = (newFiles)=>{
        setFiles(newFiles)
    }

    const productImg = (Img)=>{
        if(ProductImg === Img){
            console.log("no")
        }else{
            console.log("yes")
            setRemoveImg(current => [...current, ...ProductImg.splice(Img,1)])
            setProductImg(Img)
        }
    }

    const submitHandler = (event)=>{
        event.preventDefault();

        if(!Title || !Description || !Price || !Continents){
            return alert("모든 값을 넣어주어야 합니다.")
        }

        // 삭제하기로 설정한 기존의 img(RemoveImg)를 cloudinary에서 삭제
        if(RemoveImg.length > 0){
            axios.post('/api/product/image/delete', RemoveImg)
        }

        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        Files.map(ig => (formData.append("file", ig)))
        console.log(Files)

        axios.post('/api/product/image', formData, config)
            .then(response => {
                if (response.data.success) {
                    console.log("success!")

                    const images1= response.data.file.map(item => ({
                        public_id : item.filename,
                        path : item.path
                    }))

                    const body = {
                        //로그인된 사람의 아이디
                        writer: props.user.userData._id,
                        title: Title,
                        description: Description,
                        price: Price,
                        images: [...ProductImg, ...images1],
                        continents:Continent
                    }

                    console.log(body)

                    axios.post(`/api/product/modify_by_id?id=${productId}&type=single`, body).then(response => {
                        if (response.data.success) {
                            navigate('/')
                        } else {
                            alert('상품 수정에 실패했습니다.')
                        }
                    })
                } else {
                    alert('파일을 저장하는데 실패했습니다')
                }
            })
    }

    useEffect(() => {
        window.addEventListener('beforeunload', alertUser)
        // product 정보 가져오기
        axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
        .then(response => {
                setProduct(response.data[0])
                const product = response.data[0]
                setTitle(product.title)
                setDescription(product.description)
                setPrice(product.price)
                setContinent(product.continents)
                setProductImg(product.images)
        })
        .catch(err=>alert(err))

        return () => {
            window.removeEventListener('beforeunload', alertUser)
        }
    }, [])

    const alertUser = e => {
        e.preventDefault()
        e.returnValue = ''
    }

    console.log(RemoveImg)

    return (
        <div style={{maxWidth:'700px', margin:'2rem auto', padding:'30px'}}>
            <div style={{textAlign:'center', marginBotton:'2rem'}}>
                <h2>수정 페이지</h2>
            </div>
            
            <form>
            <FileUploadModify refreshFunction={updateFiles} refreshUpdateImg={productImg} product={Product}/>
                <label>이름</label>
                <input onChange={titleChangeHandler} value={Title} />
                <label>설명</label>
                <textarea onChange={DescriptionChangeHandler} value={Description} />
                <label>가격($)</label>
                <input onChange={PriceChangeHandler} value={Price} />
                <select className='test' onChange={ContinentChangeHandler} value={Continent}>
                    {Continents.map(item => (
                        <option key={item.key} value={item.key}>{item.value}</option>
                    ))}
                </select>
                <Button type='submit' style={{display:"block"}} onClick={submitHandler} variant="outline-secondary">
                    확인
                </Button>
            </form>
        </div>
    )
}

export default ProductModifyPage;
