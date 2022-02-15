import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import {Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
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
    const [Files, setFiles] = useState([]);

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

    const ImgUploader = async() =>{
        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        Files.map(ig => (formData.append("file", ig)))

        const ImgInfo = await axios.post('/api/product/image', formData, config)
        
        const images1= ImgInfo.data.file.map(item => ({
            public_id : item.filename,
            path : item.path
        }))

        const body = {
            //로그인된 사람의 아이디
            writer: props.user.userData._id,
            title: Title,
            description: Description,
            price: Price,
            images: images1,
            continents:Continent
        }

        axios.post('/api/product', body).then(response => {
            if (response.data.success) {
                navigate('/')
            } else {
                alert('상품 업로드에 실패했습니다.')
            }
        })
    }

    const submitHandler = (event)=>{
        event.preventDefault();

        if(!Title || !Description || !Price || !Continents){
            return alert("모든 값을 넣어주어야 합니다.")
        }

        ImgUploader();
    }

    useEffect(() => {
        window.addEventListener('beforeunload', alertUser)
        return () => {
          window.removeEventListener('beforeunload', alertUser)
        }
      }, [])
      const alertUser = e => {
        e.preventDefault()
        e.returnValue = ''
      }

    return (
        <div style={{maxWidth:'700px', margin:'2rem auto', padding:'30px'}}>
            <div style={{textAlign:'center', marginBotton:'2rem'}}>
                <h2>여행 상품 업로드</h2>
            </div>
            
            <form>
            <FileUpload refreshFunction={updateFiles}/>
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

export default UploadProductPage