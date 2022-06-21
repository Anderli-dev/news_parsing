import React, {useRef, useState} from "react";
import {MDBBtn, MDBFile, MDBInput, MDBSwitch, MDBTextArea, MDBTypography, MDBValidationItem} from 'mdb-react-ui-kit';
import axios from "axios";
import Cookies from "js-cookie";
import { Editor } from '@tinymce/tinymce-react';
import moment from 'moment';
import {DataTimePicker} from "../components/DataTimePicker";
import '../static/css/add-post.css'



export function AddPost(){
    const [formData, setFormData] = useState({
        title_preview: '',
        preview: '',
        title_post: '',
    });
    const { title_preview, preview, title_post } = formData;
    const [checked, setChecked] = useState(false);
    const [selectedImg, setSelectedImg] = useState(null);
    const datetime = useRef(null);
    const [date, setDate] = useState(null);

    const editorRef = useRef(null);

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

        let formData = new FormData();
        let imagefile = document.querySelector('#customFile');
        formData.append("img", imagefile.files[0]);
        formData.append("title", title_preview)
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

    const allSubmit = async e =>{
        e.preventDefault()
        const headers = {
            'Accept': "application/json",
            'Content-Type': "multipart/form-data",
            'x-access-token': Cookies.get('x-access-token'),
        };

        let formData = new FormData();
        let imagefile = document.querySelector('#customFile');
        formData.append("img", imagefile.files[0]);
        formData.append("title", title_preview)
        formData.append("preview", preview)
        formData.append("posted_at", date.format())
        let previewId
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/preview`, formData, {headers: headers,})
                .then(response => {
                    if (response.status === 200) {
                        previewId=response.data['previewId']
                    }
                })
                .catch(error => console.log(error.response))
        } catch (err) {
            console.log(err.response)
        }
        let data
        console.log(window.tinymce.activeEditor.getContent())
        if(title_post === ''){
            data = {
                title_post: title_preview,
                text: window.tinymce.activeEditor.getContent(),
                previewId: previewId
            }
        }else {
            data = {
                title_post: title_post,
                text: window.tinymce.activeEditor.getContent(),
                previewId: previewId
            }
        }

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/post`, data, {headers: headers,})
                .then(response => {
                    if (response.status === 200) {
                        console.log('Success')
                    }
                })
                .catch(error => console.log(error.response))
        } catch (err) {
            console.log(err.response)
        }
    }

    return(
        <div className="mt-4">
            <h1 className="mb-4">Add post</h1>
                <form className="g-3 " onSubmit={checked ? previewSubmit: allSubmit}>
                    <div className="d-flex phone-preview">
                        <div className="data">
                            <MDBValidationItem className='mb-4'>
                                <MDBInput
                                    style={{color: '#fff'}}
                                    value={title_preview}
                                    name='title_preview'
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
                        <div>
                            <MDBValidationItem className='mb-2'>
                                <MDBInput
                                    style={{color: '#fff'}}
                                    value={title_post}
                                    name='title_post'
                                    onChange={onChange}
                                    id='validationCustom01'
                                    required
                                    label='Title'
                                    labelStyle={{color:"rgb(147 147 147)"}}
                                />
                            </MDBValidationItem>

                            <MDBTypography
                                note={true}
                                noteColor='dark mb-4'
                                className='d-flex'
                                style={{backgroundColor: 'rgb(46 46 46)', height:'45px'}}
                            >
                                <p className='fw-bolder'>Note:&nbsp;</p>you can leave title blank empty
                            </MDBTypography>

                            <div className='mb-4'>
                                <Editor
                                    id='editor'
                                    apiKey='q2irgy2e9k2t4yqb3oiv28zg3vi2cli0pvhb8drka4xy3dly'
                                    onInit={(evt, editor) => editorRef.current = editor}
                                    init={{
                                        selector: 'textarea#editor',
                                        height: 700,
                                        plugins: 'image code',
                                        toolbar: 'undo redo | link image | code',
                                        image_title: true,
                                        images_upload_url: `${process.env.REACT_APP_API_URL}/api/image_upload`,
                                        convert_urls: false,

                                        automatic_uploads: true,

                                        file_picker_types: 'image',
                                        file_picker_callback: function (cb, value, meta) {

                                            var input = document.createElement('input');
                                            input.setAttribute('type', 'file');
                                            input.setAttribute('accept', 'image/*');

                                            input.onchange = function () {
                                                var file = this.files[0];
                                                console.log(file.name)
                                                var reader = new FileReader();
                                                reader.onload = function () {
                                                    var id = 'blobid' + (new Date()).getTime();
                                                    var blobCache =  window.tinymce.activeEditor.editorUpload.blobCache;
                                                    var base64 = reader.result.split(',')[1];
                                                    var blobInfo = blobCache.create(id, file, base64);
                                                    blobCache.add(blobInfo);

                                                    cb(blobInfo.blobUri(), { title: file.name });
                                                };
                                                reader.readAsText(file);
                                            };

                                            input.click();
                                        },
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'

                                    }}
                                />
                            </div>
                        </div>
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