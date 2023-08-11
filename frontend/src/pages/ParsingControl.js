import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setTab} from "../store/sideNavTab";
import {MDBBtn, MDBSwitch} from "mdb-react-ui-kit";
import Form from 'react-bootstrap/Form';
export function ParsingControl() {
    const [isRunning, setIsRunning] = useState(true)
    const [region, setRegion] = useState('')
    const [time, setTime] = useState('0')

    const tabKey = useSelector((state) => state.tabsKey.tabs.parsing)
    const dispatch = useDispatch()

    const switchChange = (e) => {
        setIsRunning(e.target.checked);
        console.log(region)
    };

    useEffect(() => {
        dispatch(setTab(tabKey))
    }, []);

    return (
        <div className="mt-4 mb-5">
             <h1 className="mb-1">Parsing control page</h1>
            <div>
                <div className="mb-4">
                    <MDBSwitch
                        checked={isRunning}
                        onChange={switchChange}
                        id='flexSwitchCheckChecked'
                        label={isRunning?'Parsing is running':'Parsing is not running'}
                    />
                </div>

                <div className="d-flex">
                    <div className="me-3">
                        <p className="m-0">Region</p>
                        <Form.Select className="py-2">
                            <option value="1">africa</option>
                            <option value="2">asia</option>
                            <option value="3">europe</option>
                            <option value="4">us_and_canada</option>
                        </Form.Select>
                    </div>

                    <div>
                        <p className="m-0">Period time(in hours):</p>
                        <input type="text" className="form-control py-2"/>
                    </div>
                </div>

                <div className="my-3">
                    <MDBBtn>Submit</MDBBtn>
                </div>
            </div>
        </div>
    );
}