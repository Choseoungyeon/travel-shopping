import React from 'react'
import './UserCartBlock.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from 'react-bootstrap';


function UserCartBlock(props) {

    const renderCartImage = (images) =>{
        if(images.length > 0){
            let image = images[0]
            return image.path
        }
    }

    const renderItems = () =>(
        props.products && props.products.map((product,index) => (
            <tr key={index}>
                <td>
                    <img style={{width:'70px'}} alt='product' src={renderCartImage(product.images)}/>
                </td>
                <td>
                    {product.quantity} EA
                </td>
                <td>
                    ${product.price}
                </td>
                <td>
                    <Button onClick={()=>props.removeItem(product._id)} variant="outline-secondary">Remove</Button>
                </td>
            </tr>
        ))
    )

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Product Image</th>
                        <th>Product Quantity</th>
                        <th>Product Price</th>
                        <th>Remove from Cart</th>
                    </tr>
                </thead>
                <tbody>
                   {renderItems()}
                </tbody>
            </table>
        </div>
    )
}

export default UserCartBlock
