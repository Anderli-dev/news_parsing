import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import '../static/css/post-detail.css'


export function PostDetail(){
    const [postData, setPostData] = useState({
        title: "",
        body: "",
    })

    const [previews, setPreviews] = useState([])

    const { title, body } = postData;

    const {id} = useParams();

    const getPreview = () => {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        try {
            axios.get(`${process.env.REACT_APP_API_URL}/api/get_preview?post_id=`+id, {
                headers: headers,
            })
                .then(response => setPreviews(response.data.data))
                .catch(error => console.log(error.response))
        } catch (err) {
            console.log(err)
        }
    }

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

        getPreview()
    }, []);

    return(
        <>
            <div className="mt-4 d-flex">
                <div className="me-5 w-75">
                    <h2>{title}</h2>
                    <div className="square border-bottom border-light w-100 mt-3"></div>
                    <div className="mt-3">
                        <p>
                            <div className="blog_content" dangerouslySetInnerHTML={{__html: body}}/>
                        </p>
                    </div>
                </div>
                <div className="w-25">
                    <p className="fs-2">Features</p>
                    {previews.map(item =>(
                        <a href={item.post_id}>
                            <div key={item.preview_id} style={{backgroundColor: "#343434"}}>
                                <img src={"../uploads/"+item.img} alt=""/>
                                <p className="py-3 px-3">{item.title}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </>
    )
}