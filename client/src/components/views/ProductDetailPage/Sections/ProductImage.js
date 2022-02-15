import React, {useState, useEffect} from 'react'
import ImageGallery from 'react-image-gallery'

function ProductImage(props) {

    const [Images, setImages] = useState([])

    useEffect(() => {

        if(props.detail.images && props.detail.images.length > 0){
            let images = []
    
            props.detail.images.map(item => (
                images.push({
                    original:item.path,
                    thumbnail:item.path
                })
            ))
            setImages(images)
        }
        
    }, [props.detail])
    

    return (
        <div>
            <ImageGallery items={Images} /> 
        </div>
    )
}

export default ProductImage
