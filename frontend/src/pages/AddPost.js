import React, {useRef, useState} from "react";
import {
    MDBBtn,
    MDBInput,
    MDBModal,
    MDBModalBody,
    MDBModalContent,
    MDBModalDialog,
    MDBModalHeader,
    MDBModalTitle,
    MDBSwitch,
    MDBTextArea,
    MDBTypography,
    MDBValidationItem
} from 'mdb-react-ui-kit';
import axios from "axios";
import Cookies from "js-cookie";
import {Editor} from '@tinymce/tinymce-react';
import {DateTimePicker} from "../components/DateTimePicker";
import '../static/css/add-post.css'
import {CreateWhiteIco} from "../actions/CreateWhiteIco";
import {TbHandClick} from "react-icons/tb";
import {BiReset} from "react-icons/bi";
import {ValidationField} from "../components/ValidationField";
import {useNavigate} from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";


export function AddPost(){
    var utc = require('dayjs/plugin/utc')
    dayjs.extend(utc)

    const [formData, setFormData] = useState({
        title_preview: '',
        preview: '',
        title_post: '',
    });

    const { title_preview, preview, title_post } = formData;

    const [checked, setChecked] = useState(false);
    const [selectedImg, setSelectedImg] = useState(null);
    const [basicModal, setBasicModal] = useState(false);
    const [postedAt, setPostedAt] = useState(dayjs());

    const [errorFields, setErrorFields] = useState({});

    const [headers] = useState(
        {
            'Accept': "application/json",
            'Content-Type': "multipart/form-data",
            'x-access-token': Cookies.get('x-access-token'),
        }
    )

    const datetime = useRef(null);
    const editorRef = useRef(null);
    const fileInputRef = useRef(null);

    const navigate = useNavigate()

    const imgModal = () => {
        return(
            <>
                <MDBModal show={basicModal} setShow={setBasicModal} tabIndex='-1'>
                    <MDBModalDialog centered size='lg'>
                        <MDBModalContent>
                            <MDBModalHeader>
                                <MDBModalTitle style={{color: "black"}}>Current image</MDBModalTitle>
                                <MDBBtn className='btn-close' color='none' type="button"
                                        onClick={toggleShow}></MDBBtn>
                            </MDBModalHeader>
                            <MDBModalBody>
                                <>
                                    {
                                        selectedImg &&
                                            <img src={URL.createObjectURL(selectedImg)} alt=""/>
                                    }
                                </>
                            </MDBModalBody>
                        </MDBModalContent>
                    </MDBModalDialog>
                </MDBModal>
            </>
        )
    }

    const toggleShow = () => setBasicModal(!basicModal);

    const resetImg = () => {
        setSelectedImg(null)
        fileInputRef.current.value = null;
    }

    const onChange = (e) => {
        if(e.target.value.length > 255 && e.target.name !=='preview' ){
            const errMsg =
            ( e.target.name ==='title_preview' && "Preview title max length 255 symbols!") ||
            ( e.target.name ==='title_post' && "Post title max length 255 symbols!")

            setErrorFields({...errorFields, [e.target.name]: errMsg});
            return
        }
        else if(errorFields[e.target.name]){
            const arr = {...errorFields}
            delete arr[e.target.name]
            setErrorFields({...arr});
        }

        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const switchChange = (e) => {
        setChecked(e.target.checked);
    };

    const handleImgSelect = (e) => {
        setSelectedImg(null)

        if (fileInputRef.current.files[0] || fileInputRef.current.files[0] === selectedImg) {
            if (!fileInputRef.current.files[0].type.includes('image/')) {
                setSelectedImg(null)
                setErrorFields({...errorFields, [e.target.name]: 'Uploaded file type is not image!'});
                resetImg()
                return
            } else if (fileInputRef.current.files[0].size > 2097152) {
                setErrorFields({...errorFields, [e.target.name]: 'Image size is too big!'});
                resetImg()
                return
            } else if (fileInputRef.current.files[0].name.length > 65534) {
                setSelectedImg(null)
                setErrorFields({...errorFields, [e.target.name]: 'Image name is too long!'});
                resetImg()
                return
            } else if(
                fileInputRef.current.files[0].type.replace('image/', '') !== 'png'&&
                fileInputRef.current.files[0].type.replace('image/', '') !== 'jpeg'&&
                fileInputRef.current.files[0].type.replace('image/', '') !== 'jpg'){
                setSelectedImg(null)
                setErrorFields({...errorFields, [e.target.name]: 'Image type only png or jpeg!'});
                resetImg()
                return
            }
            if (errorFields[e.target.name]) {
                const arr = {...errorFields}
                delete arr[e.target.name]
                setErrorFields({...arr});
            }
            setSelectedImg(fileInputRef.current.files[0])
        }
    }

    const previewSubmit = async e => {
        e.preventDefault()

        let formData = new FormData();
        let imagefile = document.querySelector('#img');
        formData.append("img", imagefile.files[0]);
        formData.append("title", title_preview)
        formData.append("preview", preview)
        formData.append("posted_at", dayjs().utc().format("YYYY[-]MM[-]DD[T]HH[:]m[:]s").toString())

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/preview`, formData, {headers: headers,})
                .then(navigate("/posts"))
                .catch(error => console.log(error.response))
        } catch (err) {
            console.log(err.response)
        }
    };

    const allSubmit = async e =>{
        e.preventDefault()

        let formData = new FormData();
        let imagefile = document.querySelector('#img');
        formData.append("img", imagefile.files[0]);
        formData.append("title", title_preview)
        formData.append("preview", preview)
        formData.append("posted_at", dayjs().utc().format("YYYY[-]MM[-]DD[T]HH[:]m[:]s").toString())

        let previewId
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/preview`, formData, {headers: headers,})
                .then(response => {
                    if (response.status === 200) {
                        console.log('Success')
                        previewId = response.data['previewId']
                    }
                })
                .catch(error => console.log(error.response))
        } catch (err) {
            console.log(err.response)
        }

        let data = {
            title_post: title_post.split(' ').join('') === '' ? title_preview : title_post,
            text: window.tinymce.activeEditor.getContent(),
            previewId: previewId
        }

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/post`, data, {headers: headers,})
                .then(response => {
                    if (response.status === 200) {
                        console.log('Success')
                        navigate("/posts")
                    }
                })
                .catch(error => console.log(error.response))
        } catch (err) {
            console.log(err.response)
        }
    }

    const imagesUploadHandler = (blobInfo) => new Promise((success, failure) => {
        let xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.open('POST', `${process.env.REACT_APP_API_URL}/api/image_upload`);
        xhr.setRequestHeader('x-access-token', Cookies.get('x-access-token')); // manually set header

        xhr.onload = function() {
            if (xhr.status === 403) {
                failure('HTTP Error: ' + xhr.status, { remove: true });
                return;
            }

            if (xhr.status !== 200) {
                failure('HTTP Error: ' + xhr.status);
                return;
            }

            let json = JSON.parse(xhr.responseText);

            if (!json || typeof json.location !== 'string') {
                failure('Invalid JSON: ' + xhr.responseText);
                return;
            }

            success(json.location);
        };

        xhr.onerror = function () {
            failure('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
        };

        let formData = new FormData();
        formData.append('file', blobInfo.blob(), blobInfo.filename());

        xhr.send(formData);
    })


    const onResetClick = () =>{
        let dict = {}
        for(let i in formData){
            dict[i] = ""
        }
        setFormData(dict)
        setPostedAt(dayjs())
        resetImg()
    }

    return(
        <div className="mt-4 mb-5">
            <h1 className="mb-4">Add post</h1>
                <form className="g-3 " onSubmit={checked ? previewSubmit: allSubmit}>
                    <div className="d-flex phone-preview">
                        <div className="data">
                            <ValidationField
                                asElement={MDBInput}
                                style={{color: '#fff'}}
                                value={title_preview}
                                name='title_preview'
                                onChange={onChange}
                                id='validationCustom01'
                                required
                                label='Preview title'
                                error={errorFields}
                            />

                            <p className="m-0" style={{color:"rgb(147 147 147)"}}>Chose posted date</p>
                            <DateTimePicker
                                ref={datetime}
                                // don't know why but 'postedAt' in UTC
                                selected={dayjs(postedAt).utc()}
                                onSelectedChange={setPostedAt}
                                initialValue={dayjs(postedAt).toDate()}
                            />

                            <MDBValidationItem className='file-container mb-4'>
                                <div className="d-flex justify-content-between">
                                    <p style={{color: "rgb(147, 147, 147)", margin: "0", marginBottom: "2px"}}>Chose preview image</p>
                                    {selectedImg&&
                                        <div className="d-flex m-0">
                                            <button type="button"
                                                    onClick={toggleShow}
                                                    style={{backgroundColor: "inherit", color: "#fff", border: "none"}}
                                            >Current image<TbHandClick/></button>

                                            <button type="button"
                                                    style={{backgroundColor: "inherit", color: "#fff", border: "none"}}
                                                    onClick={resetImg}
                                            >
                                                {CreateWhiteIco(<BiReset/>)}
                                            </button>
                                        </div>
                                    }
                                </div>

                                <div>
                                    {imgModal()}
                                </div>

                                <div className={errorFields["img"] &&'mb-4'}>
                                    <input
                                        type="file"
                                        onChange={handleImgSelect}
                                        name="img"
                                        required
                                        id='img'
                                        ref={fileInputRef}
                                        className="form-control"
                                    />
                                    {errorFields["img"]&&
                                        <div style={{color: "#DC4C64", fontSize: "15px"}} >
                                            <p className="m-0">{errorFields["img"]}</p>
                                        </div>
                                    }
                                </div>
                            </MDBValidationItem>
                        </div>

                        <MDBValidationItem className='mb-4 w-100'>
                            <ValidationField
                                asElement={MDBTextArea}
                                style={{color: '#fff', height: '215px'}}
                                value={preview}
                                name='preview'
                                onChange={onChange}
                                id='validationCustom01'
                                required
                                label='Preview'
                                error={errorFields}
                            />
                        </MDBValidationItem>
                    </div>


                    <div className="mb-4">
                        <MDBSwitch checked={checked} style={{zIndex: "10"}} onChange={switchChange} id='flexSwitchCheckDefault' label='Only preview' />
                    </div>


                    {!checked &&
                        <div>
                            <MDBValidationItem>
                                <ValidationField
                                    asElement={MDBInput}
                                    style={{color: '#fff'}}
                                    value={title_post}
                                    name='title_post'
                                    onChange={onChange}
                                    id='validationCustom01'
                                    label='Post title'
                                    labelStyle={{color:"rgb(147 147 147)"}}
                                    error={errorFields}
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
                                    name='text'
                                    apiKey='q2irgy2e9k2t4yqb3oiv28zg3vi2cli0pvhb8drka4xy3dly'
                                    onInit={(evt, editor) => editorRef.current = editor}
                                    init={{
                                        max_chars: 1000,
                                        selector: 'textarea#editor',
                                        height: 700,
                                        plugins: 'image code',
                                        toolbar: 'undo redo | link image | code',
                                        image_title: true,
                                        images_upload_url: `${process.env.REACT_APP_API_URL}/api/image_upload`,
                                        convert_urls: false,
                                        images_upload_handler: imagesUploadHandler,

                                        automatic_uploads: true,

                                        file_picker_types: 'image',
                                        file_picker_callback: function (cb, value, meta) {

                                            var input = document.createElement('input');
                                            input.setAttribute('type', 'file');
                                            input.setAttribute('accept', 'image/*');

                                            input.onchange = function () {
                                                var file = this.files[0];
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
                        <div className='col-12 d-flex justify-content-between mt-4'>
                            <MDBBtn type='submit' className="me-2">Submit form</MDBBtn>
                            <MDBBtn type='button' onClick={onResetClick}>Reset form</MDBBtn>
                        </div>
                    </div>
                </form>
        </div>
    )
}