import React, {useState} from "react";
import {MDBBtn, MDBFile, MDBInput, MDBSwitch, MDBTextArea, MDBValidationItem} from 'mdb-react-ui-kit';
import axios from "axios";
import Cookies from "js-cookie";
import { Editor } from '@tinymce/tinymce-react';


export function AddPost(){
    const [formData, setFormData] = useState({
        title: '',
        preview: '',
    });
    const { title, preview } = formData;
    const [checked, setChecked] = useState(false);
    const [selectedImg, setSelectedImg] = useState(null);

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
        // const data = {"img": selectedImg, "title": title, "preview": preview};

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
        <div>
            <h1>Add post</h1>
                <form className='row g-3' onSubmit={previewSubmit}>
                    <MDBValidationItem className='mb-4 d-flex'>
                        <MDBInput
                            style={{color: '#fff', width: '422px'}}
                            value={title}
                            name='title'
                            onChange={onChange}
                            id='validationCustom01'
                            required
                            label='Title'
                            labelStyle={{color:"rgb(147 147 147)"}}
                        />
                    </MDBValidationItem>
                    <MDBValidationItem className='col-md-4'>
                        <MDBTextArea
                            style={{color: '#fff', height: '200px'}}
                            value={preview}
                            name='preview'
                            onChange={onChange}
                            id='validationCustom01'
                            required
                            label='Preview'
                            labelStyle={{color:"rgb(147 147 147)"}}
                        />
                    </MDBValidationItem>

                    <MDBValidationItem className='file-container'>
                        <MDBFile onChange={handleImgSelect}
                                 style={{width:'422px'}}
                                 label='Chose preview image'
                                 labelStyle={{color:"rgb(147 147 147)"}}
                                 id='customFile' />
                    </MDBValidationItem>

                    <MDBSwitch checked={checked} onChange={switchChange} id='flexSwitchCheckDefault' label='Only preview' />

                    <div className='col-12'>
                        <MDBBtn type='submit' className="me-2">Submit form</MDBBtn>
                        <MDBBtn type='reset'>Reset form</MDBBtn>
                    </div>

                </form>
        </div>
    )
}