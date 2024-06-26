import React, {useEffect, useRef, useState} from "react";
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
import {useNavigate, useParams} from "react-router-dom";
import {TbHandClick} from "react-icons/tb";
import {BiReset} from "react-icons/bi";
import {CreateWhiteIco} from "../actions/CreateWhiteIco";
import {RotatingLines} from "react-loader-spinner";
import {ValidationField} from "../components/ValidationField";
import {DeleteModal} from "../components/Modals/DeleteModal";
import dayjs from "dayjs";

export function PostEdit(){
    var utc = require('dayjs/plugin/utc')
    dayjs.extend(utc)

    const [previewData, setPreviewData] = useState({
        title_preview: '',
        img: '',
        preview: '',
    });
    const [postedAt, setPostedAt] = useState("")
    const [postData, setPostData] = useState({
        post_id: "",
        title_post: "",
        body: "",
    })

    const { title_preview, img, preview } = previewData;
    const { post_id, title_post, body } = postData;

    const [checked, setChecked] = useState(false);
    const [basicModal, setBasicModal] = useState(false);
    const [isDelete, setIsDelete] = useState(false)
    const [selectedImg, setSelectedImg] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isPreviewLoading, setIsPreviewLoading] = useState(true);

    const [errorFields, setErrorFields] = useState({});

    const datetime = useRef(null);
    const editorRef = useRef(null);
    const fileInputRef = useRef(null);

    const {id} = useParams();

    const navigate = useNavigate()

    const [headers] = useState(
        {
            'Accept': "application/json",
            'Content-Type': "multipart/form-data",
            'x-access-token': Cookies.get('x-access-token'),
        }
    )


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
                                {isPreviewLoading ?
                                    <div className={"d-flex align-items-center justify-content-center py-3"}>
                                        <RotatingLines
                                            strokeWidth="5"
                                            strokeColor="#3B71CA"
                                            animationDuration="0.75"
                                            width="100"
                                            visible={true}
                                        />
                                    </div>
                                    :
                                    <>
                                        {
                                            selectedImg ?
                                                <img src={URL.createObjectURL(selectedImg)} alt=""/>
                                                :
                                                <img src={`../../uploads/${img}`} alt=""/>
                                        }
                                    </>
                                }
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
         const errMsg =
            ( e.target.name ==='title_preview' && "Preview title max length 255 symbols!") ||
            ( e.target.name ==='title_post' && "Post title max length 255 symbols!")

        if(e.target.value.length > 255 && e.target.name !=='preview'){
            setErrorFields({...errorFields, [e.target.name]: errMsg});
            return
        }
        else if(errorFields[e.target.name]){
            const arr = {...errorFields}
            delete arr[e.target.name]
            setErrorFields({...arr});
        }

        if( e.target.name ==='title_post'){
            setPostData({ ...postData, [e.target.name]: e.target.value });
        }
        else {
            setPreviewData({ ...previewData, [e.target.name]: e.target.value });
        }
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

    const previewSubmit = async () => {
        let formData = new FormData();
        if(selectedImg !== null){
            formData.append("img", selectedImg);
        }
        formData.append("title", title_preview)
        formData.append("preview", preview)
        formData.append("posted_at", dayjs(postedAt.toString()).utc().format("YYYY[-]MM[-]DD[T]HH[:]m[:]s"))
        formData.append("id", id)

        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/api/preview/`+id, formData, {headers: headers,})
                .catch(error => console.log(error.response))
        } catch (err) {
            console.log(err.response)
        }

        if(post_id){
            try {
                axios.delete(`${process.env.REACT_APP_API_URL}/api/post/` + post_id, {
                    headers: headers,
                })
                    .then(() => {
                        setIsDelete(false)
                    })
                    .catch(error => console.log(error))
            } catch (err) {
                console.log(err)
            }
        }
    };

    const allSubmit = async () =>{
        let formData = new FormData();
        if(selectedImg){
            formData.append("img", selectedImg);
        }
        formData.append("title", title_preview)
        formData.append("preview", preview)
        formData.append("posted_at", dayjs(postedAt.toString()).utc().format("YYYY[-]MM[-]DD[T]HH[:]m[:]s"))
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/api/preview/`+id, formData, {headers: headers,})
                .catch(error => console.log(error.response))
        } catch (err) {
            console.log(err.response)
        }
        if(post_id){
            let data = {
                title_post: title_post.split(' ').join('') === '' ? title_preview : title_post,
                text: window.tinymce.activeEditor.getContent(),
            }

            try {
                await axios.put(`${process.env.REACT_APP_API_URL}/api/post/`+post_id, data, {headers: headers,})
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
        else {
            let data = {
                title_post: title_post.split(' ').join('') === '' ? title_preview : title_post,
                text: window.tinymce.activeEditor.getContent(),
                previewId: id
            }

            try {
                await axios.post(`${process.env.REACT_APP_API_URL}/api/post`, data, {headers: headers,})
                    .catch(error => console.log(error.response))
            } catch (err) {
                console.log(err.response)
            }
        }

    }

    const getData = async () =>{
        let postId
        try {
             await axios.get(`${process.env.REACT_APP_API_URL}/api/preview/`+ id,{
                headers: headers,
            })
                .then(response => {
                    postId = response.data["post_id"]
                    setPostedAt(response.data['posted_at']);
                    setPreviewData({ ...previewData,
                        ["title_preview"]: response.data["title"],
                        ["img"]: response.data["img"],
                        ["preview"]: response.data["preview"]})
                    setIsPreviewLoading(false)
                })
                .catch(error => {console.log(error.response); if(error.response.status === 404){navigate("/posts")}})
        }
        catch (err) {
            console.log(err)
        }

        if(postId) {
            try {
                axios.get(`${process.env.REACT_APP_API_URL}/api/post/` + postId, {
                    headers: headers,
                })
                    .then(response => {
                        setPostData({
                            ...postData,
                            ["title_post"]: response.data["title"],
                            ["body"]: response.data["body"],
                            ["post_id"]: postId
                        })
                        setIsLoading(false)
                    })
                    .catch(error => console.log(error.response))
            } catch (err) {
                console.log(err)
            }
        }else {setIsLoading(false);setChecked(true)}
    }

    const onDeleteClick = () => {
        if(!checked && post_id){
             try {
                axios.delete(`${process.env.REACT_APP_API_URL}/api/post/` + post_id, {
                    headers: headers,
                })
                    .then(() => {
                        navigate("/posts");
                        setIsDelete(false)
                    })
                    .catch(error => console.log(error))
            } catch (err) {
                console.log(err)
            }
            try {
                axios.delete(`${process.env.REACT_APP_API_URL}/api/preview/` + id, {
                    headers: headers,
                })
                    .then(() => {
                        navigate("/posts");
                        setIsDelete(false)
                    })
                    .catch(error => console.log(error))
            } catch (err) {
                console.log(err)
            }
        }
        else {
           try {
                axios.delete(`${process.env.REACT_APP_API_URL}/api/preview/` + id, {
                    headers: headers,
                })
                    .then(() => {
                        navigate("/posts");
                        setIsDelete(false)
                    })
                    .catch(error => console.log(error))
            } catch (err) {
                console.log(err)
            }
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

    useEffect(()=>{
        getData()
    }, [])

    return(
        <div className="mt-4 mb-5">
            <h1 className="mb-4">Edit post №{id}</h1>
                <form className="g-3 " onSubmit={checked ? previewSubmit: allSubmit}>

                    <div className="d-flex phone-preview placeholder-glow">
                        <div className="data">
                            <MDBValidationItem>
                                <ValidationField
                                    asElement={MDBInput}
                                    style={{color: '#fff'}}
                                    value={isPreviewLoading?"Loading...":title_preview}
                                    name='title_preview'
                                    id='validationCustom01'
                                    required
                                    label='Preview title'
                                    className={isPreviewLoading&&"placeholder"}
                                    labelStyle={{color:"rgb(147 147 147)"}}
                                    onChange={isPreviewLoading? null :onChange}
                                    error={errorFields}
                                />
                            </MDBValidationItem>

                            <p className="m-0" style={{color:"rgb(147 147 147)"}}>Chose posted date</p>
                            {postedAt?
                                // without this construction, time it is not showing
                                <DateTimePicker
                                    ref={datetime}
                                    // don't know why but 'postedAt' in UTC
                                    selected={dayjs(postedAt).utc()}
                                    onSelectedChange={setPostedAt}
                                    initialValue={dayjs(postedAt).toDate()}
                                />
                                :
                                <div className="mb-4">
                                    <MDBInput
                                        style={{color: '#fff', marginBottom:"-1px"}}
                                        value={"Loading..."}
                                        className="placeholder"
                                        labelStyle={{color:"rgb(147 147 147)"}}
                                    />
                                </div>
                            }

                            <MDBValidationItem className='file-container mb-4'>
                                <div className="d-flex justify-content-between">
                                    <p className="m-0" style={{color: "rgb(147, 147, 147)"}}>Chose preview image</p>
                                    <div className="d-flex">
                                        <button type="button"
                                                onClick={toggleShow}
                                                className="m-0"
                                                style={{backgroundColor: "inherit", color: "#fff", border: "none"}}
                                        >Current image<TbHandClick/></button>
                                        {selectedImg&&
                                            <button type="button"
                                                    style={{backgroundColor: "inherit", color: "#fff", border: "none"}}
                                                    onClick={resetImg}
                                            >
                                                {CreateWhiteIco(<BiReset/>)}
                                            </button>}
                                    </div>
                                </div>

                                <div>
                                    {imgModal()}
                                </div>

                                <div className={errorFields["img"] &&'mb-4'}>
                                    <input
                                        type="file"
                                        onChange={handleImgSelect}
                                        name="img"
                                        id='img'
                                        disabled={isLoading&&true}
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
                                value={isPreviewLoading?"Loading...":preview}
                                name='preview'
                                onChange={isPreviewLoading? null :onChange}
                                id='validationCustom01'
                                required
                                className={isPreviewLoading&&"placeholder"}
                                label='Preview'
                                labelStyle={{color:"rgb(147 147 147)"}}
                                error={errorFields}
                            />
                        </MDBValidationItem>
                    </div>


                    <div className="mb-4">
                        <MDBSwitch checked={checked} onChange={switchChange} disabled={isLoading&&true} id='flexSwitchCheckDefault' label='Only preview' />
                    </div>


                    {!checked &&
                        <div className="placeholder-glow">
                            <MDBValidationItem>
                                <ValidationField
                                    asElement={MDBInput}
                                    style={{color: '#fff'}}
                                    value={isLoading?"Loading...":title_post}
                                    name='title_post'
                                    onChange={isPreviewLoading? null :onChange}
                                    id='validationCustom01'
                                    label='Post title'
                                    className={isLoading&&"placeholder"}
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

                            <div className={isLoading&&"placeholder"}>
                                <Editor
                                    id='editor'
                                    apiKey='q2irgy2e9k2t4yqb3oiv28zg3vi2cli0pvhb8drka4xy3dly'
                                    initialValue={body}
                                    disabled={isLoading&&true}
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
                            <MDBBtn type="button" onClick={allSubmit} disabled={isLoading&&true} className="me-2">Submit form</MDBBtn>
                            <MDBBtn type="button"
                                    className="btn btn-danger"
                                    onClick={()=>setIsDelete(true)}
                                    disabled={isLoading&&true}
                            >
                                Delete
                            </MDBBtn>
                        </div>
                        {isDelete && <DeleteModal onDeleteClick={onDeleteClick} setIsDelete={setIsDelete}/>}
                    </div>
                </form>
        </div>
    )
}