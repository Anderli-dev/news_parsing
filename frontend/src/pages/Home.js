import React, {useEffect, useState} from "react";
import axios from "axios";
import {MDBBtn, MDBCardBody, MDBCardImage, MDBCardText, MDBCardTitle} from "mdb-react-ui-kit";
import moment from 'moment';
import {Button} from "react-bootstrap";


export function Home(){
    const [posts, setPosts] = useState([]);
    const [isData, setIsData] = useState(false);

    function getPosts(){
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        try {
            axios.get(`${process.env.REACT_APP_API_URL}/api/posts`, {
                headers: headers,})
                .then(response => {
                    if (!response.data['posts'].length) {setIsData(false);}
                    else {setIsData(true); setPosts(response.data['posts'])}
                })
                .catch(error => console.log(error))
        } catch (err) {
            console.log(err)
        }
        }

    useEffect(() => {
        getPosts();
    }, []);

    return(
        <div className="dark d-flex flex-column align-items-center pt-4">
            {posts.map(item => (
                <div key={item.preview_id}
                     style={{
                         width: "50rem",
                         color:"black",
                         backgroundColor:"#fff",
                         borderRadius:"10px",
                         boxShadow:"0px 5px 31px 4px rgba(0,0,0,0.75)"}}
                     className="mb-4 px-3 pt-4 pb-3">
                    <p className="m-0">{moment(item.posted_at).calendar()}</p>
                    <MDBCardTitle className='mb-3'>{item.title}</MDBCardTitle>

                    <div className="d-flex">
                        <MDBCardImage className="img-fluid"
                                      src={"uploads/"+item.img}
                                      style={{width: "350px"}}/>
                        <MDBCardBody className="py-0 pe-0">
                            <MDBCardText>
                                {item.preview}
                            </MDBCardText>
                            <MDBBtn href={'post/'+item.post_id}>Read more></MDBBtn>
                        </MDBCardBody>
                    </div>

                    <div className="d-flex">
                        <MDBBtn  className="m-0 mt-3 me-2 p-0" style={{width:'30px', height:'30px'}}></MDBBtn>
                        <MDBBtn  className="m-0 mt-3 me-2 p-0" style={{width:'30px', height:'30px'}}></MDBBtn>
                        <MDBBtn  className="m-0 mt-3 me-2 p-0" style={{width:'30px', height:'30px'}}></MDBBtn>
                    </div>
                </div>
            ))}
        </div>
    )
}