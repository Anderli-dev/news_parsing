import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import '../static/css/post-detail.css'


export function PostDetail(){
    const [postData, setPostData] = useState({
        title: "",
        body: "",

    })

    const { title, body } = postData;

    const {id} = useParams();

    useEffect(() => {
        // load post
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        try {
            axios.get(`${process.env.REACT_APP_API_URL}/api/post/`+ id,{
                headers: headers,
            })
                .then(response => {setPostData({ ...postData, ["title"]: response.data["title"],
                    ["body"]: response.data["body"],})
                })
                .catch(error => console.log(error.response))
        }
        catch (err) {
            console.log(err)
        }
    }, []);


    return(
        <>
            <div className="mt-4 d-flex">
                <div className="me-5">
                    <h2>{title}</h2>
                    <div className="square border-bottom border-light w-100 mt-3"></div>
                    <div className="mt-3">
                        <p>
                            <div className="blog_content" dangerouslySetInnerHTML={{__html: body}}/>
                        </p>
                    </div>
                </div>
                <div className="w-50">
                    <p className="fs-2">Features</p>
                </div>
            </div>
        </>
    )
}