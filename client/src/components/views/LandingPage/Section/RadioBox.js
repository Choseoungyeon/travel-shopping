import React from 'react'
import { Accordion, Form} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function RadioBox(props) {

    const handleChange = (event) =>{
        props.handleFilters(event.target.value)
    }

    return (
        <Accordion>
            <Accordion.Item eventKey="0">
                <Accordion.Header style={{marginTop:"0px"}}>Price</Accordion.Header>
                <Accordion.Body>
                    <Form>
                        {props.list.map((country, index) =>(
                            <Form.Check
                                inline
                                key={index}
                                style={{height:"35px"}}
                                type="radio"
                                name="test"
                                id={country._id}
                                label={country.name}
                                value={country._id}
                                onChange={handleChange}
                            />
                        ))}
                    </Form>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}

export default RadioBox
