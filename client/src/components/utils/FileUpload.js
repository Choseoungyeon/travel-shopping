import React from 'react'
import Dropzone from 'react-dropzone'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import {useState} from 'react'

function FileUpload(props) {
    
  const [Attachment, setAttachment] = useState([]);
  const [Files, setFiles] = useState([]);

  const dropHandler = (files) => {
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) =>{
      const {
        currentTarget:{result},
      } = finishedEvent
      setAttachment(current => [...current, result])
    }
    reader.readAsDataURL(files[0])


    setFiles(current => [...current, files[0]])
    props.refreshFunction(current => [...current, files[0]])
  }

  const deleteHandler=(im)=>{
    const currentIndex = Attachment.indexOf(im)
    let newAttachment = [...Attachment]
    newAttachment.splice(currentIndex,1)
    setAttachment(newAttachment)

    Files.forEach((file)=>{
      const reader = new FileReader();
      reader.onloadend = (finishedEvent) => {
        const {
          currentTarget: { result },
        } = finishedEvent
        if(im===result){
          const currentFile = Files.indexOf(file)
          let newFile = [...Files]
          newFile.splice(currentFile,1)
          setFiles(newFile);
          props.refreshFunction(newFile);
        }
      }
      reader.readAsDataURL(file)
    })
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
                    {Attachment.map((image, index) => (
                        <div onClick={()=> deleteHandler(image)} key={index}>
                            <img style={{minWidth:'300px', width:'300px', height:'240px'}}src={image}/>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default FileUpload
