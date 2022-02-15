import React from 'react'
import { Accordion, Form } from 'react-bootstrap';
import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

function CheckBox(props) {

    const [Checked, setChecked] = useState([])

    const handleToggle = (value) =>{
        //누른 것의 Index를 구하고

        const currntIndex = Checked.indexOf(value)

        //전체 Checked된 State에서 현재 누른 Checkbox가 이미 있다면

        const newChecked = [...Checked]

        //State 넣어준다.
        if(currntIndex === -1){
            newChecked.push(value)
        //빼주고
        }else{
            newChecked.splice(currntIndex, 1)
        }

        setChecked(newChecked)
        props.handleFilters(newChecked)
    }

    return (
        <Accordion>
            <Accordion.Item eventKey="0">
                <Accordion.Header style={{marginTop:"0px"}}>Country</Accordion.Header>
                <Accordion.Body>
                    <Form>
                        {props.list.map((country, index) =>(
                            <Form.Check
                                inline
                                style={{height:"35px"}}
                                key={index}
                                onChange={()=>handleToggle(country._id)}
                                type="checkbox"
                                checked={Checked.indexOf(country._id) === -1 ? false : true}
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
