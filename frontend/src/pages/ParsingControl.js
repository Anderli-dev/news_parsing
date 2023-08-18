import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setTab} from "../store/sideNavTab";
import {MDBBtn, MDBSpinner, MDBSwitch} from "mdb-react-ui-kit";
import Form from 'react-bootstrap/Form';
import Cookies from "js-cookie";
import axios from "axios";

export function ParsingControl() {
    const [isRunning, setIsRunning] = useState(false)
    const [parsingLoading, setParsingLoading] = useState(false)
    const [region, setRegion] = useState('')
    const [time, setTime] = useState('0')

    const tabKey = useSelector((state) => state.tabsKey.tabs.parsing)
    const dispatch = useDispatch()

    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('x-access-token'),
    };

    const onSwitch = () =>{
        let data = {
            isRunning: isRunning,
        }
        try {
            axios.put(`${process.env.REACT_APP_API_URL}/api/parsing_control`, data,{
                headers: headers,})
                .then(response => console.log(response))
                .catch(error => console.log(error))
        } catch (err) {
            console.log(err)
        }
    }

    const switchChange = () => {
        setParsingLoading(true)
        setIsRunning(!isRunning)
        setTimeout(()=>{onSwitch();setParsingLoading(false)}, 2000)
    };

    const getSettings = () =>{
        try {
            axios.get(`${process.env.REACT_APP_API_URL}/api/parsing_settings`, {
                headers: headers,})
                .then(response => {
                    setIsRunning(response.data.isRunning)
                    setRegion(response.data.region)
                    setTime(response.data.time)
                })
                .catch(error => {console.log(error.response)})
        } catch (err) {
            console.log(err)
        }
    }

    const onSubmit = () =>{
        let data = {
            isRunning: isRunning,
            region: region,
            time:Math.round(parseFloat(time))
        }
        try {
            axios.put(`${process.env.REACT_APP_API_URL}/api/parsing_settings`, data,{
                headers: headers,})
                .then(response => console.log(response))
                .catch(error => console.log(error))
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        dispatch(setTab(tabKey))
        getSettings()
    }, []);

    return (
        <div className="mt-4 mb-5">
             <h1 className="mb-1">Parsing control page</h1>
            <div>
                <div className="mb-4 d-flex">
                    <MDBSwitch checked={isRunning}
                               btn
                               onChange={switchChange}
                               label={isRunning?'Parsing is running':'Parsing is not running'}
                               id="switchExample"
                               btnColor="danger"
                               disabled={parsingLoading}
                               wrapperClass="p-0"
                    />
                    {!parsingLoading ||
                        <MDBSpinner color='light' className="ms-3" style={{marginTop: "2px"}}>
                            <span className='visually-hidden'>Loading...</span>
                        </MDBSpinner>
                    }
                </div>

                <div className="d-flex">
                    <div className="me-3">
                        <p className="m-0">Region</p>
                        <Form.Select className="py-2" value={region} onChange={e=>setRegion(e.target.value)}>
                            <option value="africa">africa</option>
                            <option value="asia">asia</option>
                            <option value="europe">europe</option>
                            <option value="us_and_canada">us_and_canada</option>
                        </Form.Select>
                    </div>

                    <div>
                        <p className="m-0">Period time(in hours):</p>
                        <input type="number" value={time} onChange={e=>setTime(e.target.value)} step="1" min="1" className="form-control py-2"/>
                    </div>
                </div>

                <div className="my-3">
                    <MDBBtn onClick={onSubmit}>Submit</MDBBtn>
                </div>
            </div>
        </div>
    );
}