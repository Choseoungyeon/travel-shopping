import React from 'react'
import { Accordion, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function CheckBox({ list }) {

    return (
        <Accordion>
            <Accordion.Item eventKey="0">
                <Accordion.Header style={{marginTop:"0px"}}>Country</Accordion.Header>
                <Accordion.Body>
                    <Form>
                        {list.map((country, index) =>(
                            <Form.Check
                                inline
                                key={index}
                                type="checkbox"
                                checked={false}
                                id={country._id}
                                label={country.name}
                            />
                        ))}
                    </Form>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}

export default CheckBox
