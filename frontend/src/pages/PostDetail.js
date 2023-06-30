import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import '../static/css/post-detail.css'
import {LoadingPreview} from "../components/LoadingPreview";


export function PostDetail(){
    const [postData, setPostData] = useState({
        title: "",
        body: "",
    })
    const [isLoading, setIsLoading] = useState(true);
    const [isFeaturesLoading, setIsFeaturesLoading] = useState(true);


    const [previews, setPreviews] = useState([])

    const { title, body } = postData;

    const {id} = useParams();

    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    const getPreview = () => {
        try {
            axios.get(`${process.env.REACT_APP_API_URL}/api/get_preview?post_id=`+id, {
                headers: headers,
            })
                .then(response => {setPreviews(response.data.data); setIsFeaturesLoading(false)} )
                .catch(error => console.log(error.response))
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        // load post
        try {
            axios.get(`${process.env.REACT_APP_API_URL}/api/post/`+ id,{
                headers: headers,
            })
                .then(response => {setPostData({ ...postData,
                    ["title"]: response.data["title"],
                    ["body"]: response.data["body"],})
                    setIsLoading(false)
                })
                .catch(error => console.log(error.response))
        }
        catch (err) {
            console.log(err)
        }

        getPreview()
    }, []);

    return(
        <>
            <div className="mt-4 d-flex">
                <div className="me-5 w-75 placeholder-glow">
                    {isLoading?
                        <span className='placeholder w-100 h2'></span>
                        :
                        <h2>{title}</h2>
                    }
                    <div className="square border-bottom border-light w-100 mt-3"></div>
                    {isLoading ?
                        <>
                            <div className="mt-3">
                                <div>
                                    <span className='placeholder w-100'></span>
                                    <span className='placeholder w-100'></span>
                                </div>
                                <div className="mt-2">
                                    <span className='placeholder w-100'></span>
                                    <span className='placeholder w-100'></span>
                                    <span className='placeholder w-100'></span>
                                </div>
                                <div className="mt-2">
                                    <span className='placeholder w-100'></span>
                                </div>
                                <div className="mt-2">
                                    <span className='placeholder w-100'></span>
                                    <span className='placeholder w-100'></span>
                                    <span className='placeholder w-100'></span>
                                </div>
                                <div className="mt-2">
                                    <span className='placeholder w-100'></span>
                                    <span className='placeholder w-100'></span>
                                    <span className='placeholder w-100'></span>
                                </div>
                                <div>
                                    <span className='placeholder w-100'></span>
                                    <span className='placeholder w-100'></span>
                                    <span className='placeholder w-100'></span>
                                    <span className='placeholder w-100'></span>
                                    <span className='placeholder w-100'></span>
                                </div>
                                <div className="mt-2">
                                    <span className='placeholder w-100'></span>
                                </div>
                                <div className="mt-2">
                                    <span className='placeholder w-100'></span>
                                    <span className='placeholder w-100'></span>
                                    <span className='placeholder w-100'></span>
                                </div>
                                <div className="mt-2">
                                    <span className='placeholder w-100'></span>
                                    <span className='placeholder w-100'></span>
                                    <span className='placeholder w-100'></span>
                                </div>
                            </div>
                        </>

                        :
                        <>
                            <div className="mt-3">
                                <p>
                                    <div className="blog_content" dangerouslySetInnerHTML={{__html: body}}/>
                                </p>
                            </div>
                        </>
                    }
                </div>
                <div className="w-25">
                    <p className="fs-2">Features</p>
                    {isFeaturesLoading?
                        <>
                            <LoadingPreview/>
                            <LoadingPreview/>
                            <LoadingPreview/>
                        </>
                        :
                        <>
                            {previews.map(item =>(
                                <a href={item.post_id}>
                                    <div key={item.preview_id} style={{backgroundColor: "#343434"}}>
                                        <img src={"../uploads/"+item.img} alt="" loading="lazy"/>
                                        <p className="py-3 px-3">{item.title}</p>
                                    </div>
                                </a>
                            ))}
                        </>
                    }
                </div>
            </div>
        </>
    )
}