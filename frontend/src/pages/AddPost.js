import React, {useRef, useState} from "react";
import {MDBBtn, MDBFile, MDBInput, MDBSwitch, MDBTextArea, MDBValidationItem} from 'mdb-react-ui-kit';
import axios from "axios";
import Cookies from "js-cookie";
import { Editor } from '@tinymce/tinymce-react';
import moment from 'moment';
import {DataTimePicker} from "../components/DataTimePicker";
import '../static/css/add-post.css'



export function AddPost(){
    const [formData, setFormData] = useState({
        title: '',
        preview: '',
    });
    const { title, preview } = formData;
    const [checked, setChecked] = useState(false);
    const [selectedImg, setSelectedImg] = useState(null);
    const datetime = useRef(null);
    const [date, setDate] = useState(null);



    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const switchChange = (e) => {
        setChecked(e.target.checked);
    };

    const handleImgSelect = (e) => {
        setSelectedImg(e.target.files[0])
    }

    const previewSubmit = async e => {
        e.preventDefault()
        const headers = {
            'Accept': "application/json",
            'Content-Type': "multipart/form-data",
            'x-access-token': Cookies.get('x-access-token'),
        };
        console.log(selectedImg)
        let formData = new FormData();
        let imagefile = document.querySelector('#customFile');
        formData.append("img", imagefile.files[0]);
        formData.append("title", title)
        formData.append("preview", preview)
        formData.append("posted_at", date.format())

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/preview`, formData, {headers: headers,})
                .then(response => {
                    if (response.status === 200) {
                        console.log('Success')
                    }
                })
                .catch(error => console.log(error.response))
        } catch (err) {
            console.log(err.response)
        }
    };

    return(
        <div className="mt-4">
            <h1 className="mb-4">Add post</h1>
                <form className="g-3 " onSubmit={previewSubmit}>
                    <div className="d-flex phone-preview">
                        <div className="data">
                            <MDBValidationItem className='mb-4'>
                                <MDBInput
                                    style={{color: '#fff'}}
                                    value={title}
                                    name='title'
                                    onChange={onChange}
                                    id='validationCustom01'
                                    required
                                    label='Title'
                                    labelStyle={{color:"rgb(147 147 147)"}}
                                />
                            </MDBValidationItem>

                            <p className="m-0" style={{color:"rgb(147 147 147)"}}>Chose posted date</p>
                            <DataTimePicker
                                ref={datetime}
                                selected={date}
                                onChange={date => setDate(date)}
                                initialValue={moment([])}
                            />

                            <MDBValidationItem className='file-container mb-4'>
                                <MDBFile onChange={handleImgSelect}
                                         label='Chose preview image'
                                         labelStyle={{color:"rgb(147 147 147)"}}
                                         id='customFile' />
                            </MDBValidationItem>
                        </div>

                        <MDBValidationItem className='mb-4 w-100'>
                            <MDBTextArea
                                style={{color: '#fff', height: '215px'}}
                                value={preview}
                                name='preview'
                                onChange={onChange}
                                id='validationCustom01'
                                required
                                label='Preview'
                                labelStyle={{color:"rgb(147 147 147)"}}
                            />
                        </MDBValidationItem>
                    </div>

                    <div className="mb-4">
                        <MDBSwitch checked={checked} onChange={switchChange} id='flexSwitchCheckDefault' label='Only preview' />
                    </div>

                    {!checked &&
                        <div>hello</div>
                    }

                    <div>
                        <div className='col-12'>
                            <MDBBtn type='submit' className="me-2">Submit form</MDBBtn>
                            <MDBBtn type='reset'>Reset form</MDBBtn>
                        </div>
                    </div>
                </form>
        </div>
    )
}