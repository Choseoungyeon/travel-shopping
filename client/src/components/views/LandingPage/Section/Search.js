import React from 'react'
import {InputGroup, Button, FormControl} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Search(props) {

    const onChange = (event)=>{
        props.refreshFunction(event.target.value)
      }
    return (
        <InputGroup className="mb-3" style={{height:"40px", marginTop:"20px"}}>
            <FormControl
                style={{height:"100%"}}
                placeholder="Search country"
                aria-describedby="basic-addon2"
                onChange={onChange}
            />
            <Button  style={{height:"100%"}} variant="outline-secondary" id="button-addon2">
                Button
            </Button>
        </InputGroup>
    )
}

export default Search
