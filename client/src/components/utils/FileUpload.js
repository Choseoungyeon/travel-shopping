import React from 'react'
import Dropzone from 'react-dropzone'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import {useState} from 'react'

function FileUpload(props) {
    
    const [Images, setImages] = useState([]);

    const dropHandler = (files)=>{
        let formData = new FormData();

        const config = {
            header:{'content-type':'multipart/fomr-data'}
        }

        formData.append("file", files[0])

        axios.post('/api/product/image', formData, config )
        .then(response => {
            if(response.data.success){
                setImages([...Images, `${response.data.filePath}/${response.data.file}`])
                props.refreshFunction([...Images, `${response.data.filePath}/${response.data.file}`])
            }else{
                alert('파일을 저장하는데 실패했습니다')
            }
        })   
    }

    const deleteHandler = (image) =>{
        const currentIndex = Images.indexOf(image)
        let newImages = [...Images]
        newImages.splice(currentIndex,1)
        setImages(newImages)
        props.refreshFunction(newImages)

        let target ={imageName: Images[currentIndex]} 
        axios.post('/api/product/image/delete', target).then(response => console.log(response.data))
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Dropzone onDrop={dropHandler}>
                {({ getRootProps, getInputProps }) => (
                    <div style={{ width: 300, height: 240, border: '1px solid lightgray', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', margin: '0px auto 30px', cursor:'pointer' }} 
                    {...getRootProps()}>
                        <input {...getInputProps()} />
                        <FontAwesomeIcon style={{width:50, height:50, opacity:0.3}} icon={faPlus} />
                    </div>
                )}
            </Dropzone>
            <div style={{display:'flex', width:"350px", height:"240px", overflowX:'scroll', overflowY:'hidden'}}>
                    {Images.map((image, index) => (
                        <div onClick={()=> deleteHandler(image)} key={index}>
                            <img style={{minWidth:'300px', width:'300px', height:'240px'}}src={`http://localhost:5000/${image}`}/>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default FileUpload
