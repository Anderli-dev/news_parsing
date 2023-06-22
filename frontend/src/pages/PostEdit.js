import React, {useEffect, useRef, useState} from "react";
import {
    MDBBtn,
    MDBFile,
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
import moment from 'moment';
import {DataTimePicker} from "../components/DataTimePicker";
import '../static/css/add-post.css'
import {useNavigate, useParams} from "react-router-dom";
import {TbHandClick} from "react-icons/tb";
import {BiReset} from "react-icons/bi";
import {CreateWhiteIco} from "../actions/CreateWhiteIco";

export function PostEdit(){
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
    const [imgIsSelected, setImgIsSelected] = useState(false);
    const [selectedImg, setSelectedImg] = useState(null);

    const datetime = useRef(null);

    const {id} = useParams();

    const navigate = useNavigate()

    const [headers] = useState(
        {
            'Accept': "application/json",
            'Content-Type': "multipart/form-data",
            'x-access-token': Cookies.get('x-access-token'),
        }
    )

    const editorRef = useRef(null);

    const imgModel = () => {
        return(
            <>
                <MDBModal show={basicModal} setShow={setBasicModal} tabIndex='-1'>
                    <MDBModalDialog centered size='lg'>
                        <MDBModalContent>
                            <MDBModalHeader>
                                <MDBModalTitle style={{color:"black"}}>Current image</MDBModalTitle>
                                <MDBBtn className='btn-close' color='none' type="button" onClick={toggleShow}></MDBBtn>
                            </MDBModalHeader>
                            <MDBModalBody>
                                {imgIsSelected?
                                    <img src={selectedImg} alt=""/>
                                    :
                                    <img src={`../../uploads/${img}`} alt=""/>
                                }
                            </MDBModalBody>
                        </MDBModalContent>
                    </MDBModalDialog>
                </MDBModal>
            </>
        )
    }

    const toggleShow = () => setBasicModal(!basicModal);

    const onPreviewChange = (e) => {
        setPreviewData({ ...previewData, [e.target.name]: e.target.value });
    };

    const onPostChange = (e) => {
        setPostData({ ...postData, [e.target.name]: e.target.value });
    };

    const switchChange = (e) => {
        setChecked(e.target.checked);
    };

    const handleImgSelect = (e) => {
        if(e.target.files[0]) {
            setSelectedImg(URL.createObjectURL(e.target.files[0]))
            setImgIsSelected(true)
        }
        else {
            setImgIsSelected(false)
        }
        // setSelectedImg(e.target.files[0])
    }

    const previewSubmit = async e => {
        let formData = new FormData();
        let imagefile = document.querySelector('#img');
        if(imgIsSelected){
            formData.append("img", imagefile.files[0]);
        }
        formData.append("title", title_preview)
        formData.append("preview", preview)
        // TODO add auto time
        formData.append("posted_at", moment(postedAt.toString()).format("YYYY[-]MM[-]DD[T]h[:]m[:]s"))
        formData.append("id", id)

        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/api/preview`, formData, {headers: headers,})
                .catch(error => console.log(error.response))
        } catch (err) {
            console.log(err.response)
        }
    };

    const allSubmit = async e =>{

        let formData = new FormData();
        let imagefile = document.querySelector('#img');
        if(imgIsSelected){
            formData.append("img", imagefile.files[0]);
        }
        formData.append("title", title_preview)
        formData.append("preview", preview)
        // TODO add auto time
        formData.append("posted_at", moment(postedAt.toString()).format("YYYY[-]MM[-]DD[T]h[:]m[:]s"))
        formData.append("id", id)

        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/api/preview`, formData, {headers: headers,})
                .catch(error => console.log(error.response))
        } catch (err) {
            console.log(err.response)
        }

        let data = {
            title_post: title_post === '' ? title_preview : title_post,
            text: window.tinymce.activeEditor.getContent(),
            preview_id: id,
            post_id: post_id
        }

        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/api/post`, data, {headers: headers,})
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
                })
                .catch(error => console.log(error.response))
        }
        catch (err) {
            console.log(err)
        }

        try {
            axios.get(`${process.env.REACT_APP_API_URL}/api/post/`+ postId,{
                headers: headers,
            })
                .then(response => {
                    setPostData({ ...postData,
                        ["title_post"]: response.data["title"],
                        ["body"]: response.data["body"],
                        ["post_id"]:postId})
                })
                .catch(error => console.log(error.response))
        }
        catch (err) {
            console.log(err)
        }
    }

    const resetImg = () => {
        setImgIsSelected(false)
    }

    const onDeleteClick = () => {
        try {
            axios.delete(`${process.env.REACT_APP_API_URL}/api/post/`+id,{
                headers: headers,})
                .then(response => {
                    console.log(response); navigate("/users")})
                .catch(error => console.log(error))
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(()=>{
        getData()
    }, [])

    return(
        <div className="mt-4 mb-5">
            <h1 className="mb-4">Edit post №{post_id}</h1>
                <form className="g-3 " onSubmit={checked ? previewSubmit: allSubmit}>

                    <div className="d-flex phone-preview">
                        <div className="data">
                            <MDBValidationItem className='mb-4'>
                                <MDBInput
                                    style={{color: '#fff'}}
                                    value={title_preview}
                                    name='title_preview'
                                    id='validationCustom01'
                                    required
                                    label='Preview title'
                                    labelStyle={{color:"rgb(147 147 147)"}}
                                    onChange={onPreviewChange}
                                />
                            </MDBValidationItem>

                            <p className="m-0" style={{color:"rgb(147 147 147)"}}>Chose posted date</p>

                            {postedAt&&
                                // without this construction, time is not showing
                                <DataTimePicker
                                    ref={datetime}
                                    selected={moment(postedAt).format("MM-DD-YYYY")}
                                    onChange={posted_at => setPostedAt(posted_at)}
                                    initialValue={moment(postedAt)}
                                />
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
                                        {imgIsSelected&&
                                            <button type="button"
                                                    style={{backgroundColor: "inherit", color: "#fff", border: "none"}}
                                                    onClick={resetImg}
                                            >
                                                {CreateWhiteIco(<BiReset/>)}
                                            </button>}
                                    </div>
                                </div>
                                <div>
                                    {imgModel()}
                                </div>
                                <MDBFile onChange={handleImgSelect}
                                         labelStyle={{color:"rgb(147 147 147)"}}
                                         id='img'
                                />
                            </MDBValidationItem>

                        </div>

                        <MDBValidationItem className='mb-4 w-100'>
                            <MDBTextArea
                                style={{color: '#fff', height: '215px'}}
                                value={preview}
                                name='preview'
                                onChange={onPreviewChange}
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
                                    onChange={onPostChange}
                                    id='validationCustom01'
                                    label='Post title'
                                    labelStyle={{color:"rgb(147 147 147)"}}
                                />
                            </MDBValidationItem>

                            <MDBTypography
                                note={true}
                                noteColor='dark mb-4'
                                className='d-flex'
                                style={{backgroundColor: 'rgb(46 46 46)', height:'45px'}}
                            >
                                {/*TODO remove p element*/}
                                <p className='fw-bolder'>Note:&nbsp;</p>you can leave title blank empty
                            </MDBTypography>

                            <div>
                                <Editor
                                    id='editor'
                                    apiKey='q2irgy2e9k2t4yqb3oiv28zg3vi2cli0pvhb8drka4xy3dly'
                                    initialValue={body}
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
                            <MDBBtn onClick={allSubmit} className="me-2">Submit form</MDBBtn>
                            <MDBBtn type="button"
                                    className="btn btn-danger mt-4"
                                    onClick={onDeleteClick}
                            >
                                Delete
                            </MDBBtn>
                        </div>
                    </div>
                </form>
        </div>
    )
}