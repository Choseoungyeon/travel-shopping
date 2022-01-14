import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'
import "./UploadProductPage.moduel.css"
import FileUpload from '../../utils/FileUpload'
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

function UploadProductPage(props) {

    const navigate = useNavigate(); 

    const [Title, setTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Price, setPrice] = useState(0)
    const [Continent, setContinent] = useState(1)
    const [Images, setImages] = useState([])

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

    const updateImages = (newImages)=>{
        setImages(newImages)
    }

    const submitHandler = (event)=>{
        event.preventDefault();

        if(!Title || !Description || !Price || !Continents || !Images){
            return alert("모든 값을 넣어주어야 합니다.")
        }

        const body = {
            //로그인된 사람의 아이디
            writer: props.user.userData._id,
            title:Title,
            description:Description,
            price:Price,
            images:Images,
            continents:Continents
        }

        axios.post('/api/product', body).then(response => {
            if(response.data.success){
                alert('상품 업로드에 성공했습니다.')
                navigate('/')
            }else{
                alert('상품 업로드에 실패했습니다.')
            }
        })
    }

    return (
        <div style={{maxWidth:'700px', margin:'2rem auto', padding:'30px'}}>
            <div style={{textAlign:'center', marginBotton:'2rem'}}>
                <h2>여행 상품 업로드</h2>
            </div>
            
            <form onSubmit={submitHandler}>
            <FileUpload refreshFunction={updateImages}/>
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
                <button type='submit'>
                    확인
                </button>
            </form>
        </div>
    )
}

export default UploadProductPage