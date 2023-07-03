import React, {useEffect, useState} from "react";
import axios from "axios";
import {MDBBtn, MDBCardBody, MDBCardImage, MDBCardText, MDBCardTitle} from "mdb-react-ui-kit";
import moment from 'moment';
import {MdArrowForward, MdFacebook, MdShare} from "react-icons/md";
import {SiTwitter} from "react-icons/si";
import Cookies from "js-cookie";
import {setTab} from "../store/sideNavTab";
import {useDispatch, useSelector} from "react-redux";
import {HomeLoadingPost} from "../components/HomeLoadingPost";

export function Home(){
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const tabKey = useSelector((state) => state.tabsKey.tabs.home)
    const dispatch = useDispatch()

    function getPosts(){
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('x-access-token'),
        };
        try {
            axios.get(`${process.env.REACT_APP_API_URL}/api/posts`, {
                headers: headers,})
                .then(response => {
                    if (!response.data['posts'].length) {setIsLoading(true);}
                    else {setIsLoading(false); setPosts(response.data['posts'])}
                })
                .catch(error => console.log(error))
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        dispatch(setTab(tabKey))
        getPosts();
    }, []);

    return(
        <div className="dark d-flex flex-column align-items-center pt-4">
            {isLoading?
                <>
                    <HomeLoadingPost/>
                    <HomeLoadingPost/>
                    <HomeLoadingPost/>
                    <HomeLoadingPost/>
                    <HomeLoadingPost/>
                </>
                :
                <>
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
                                    <MDBBtn href={'post/'+item.post_id} className='px-3'>
                                        <div className='d-flex'>
                                            <p className='m-0 me-2'>Read more</p>
                                            <MdArrowForward size={"1.5em"} style={{marginTop: '-1px'}}/>
                                        </div>
                                    </MDBBtn>
                                </MDBCardBody>
                            </div>

                            <div className="d-flex">
                                <MDBBtn  className="m-0 mt-3 me-2 p-0 d-flex align-items-center"
                                         style={{height:'30px'}}>
                                    <SiTwitter className="mx-2"/>
                                </MDBBtn>
                                <MDBBtn  className="m-0 mt-3 me-2 p-0 d-flex align-items-center"
                                         style={{height:'30px'}}>
                                    <MdFacebook className="mx-2"/>
                                </MDBBtn>
                                <MDBBtn  className="m-0 mt-3 me-2 p-0 d-flex align-items-center"
                                         style={{height:'30px'}}>
                                    <MdShare className="mx-2"/>
                                    <p className="m-0 me-3">Share</p>
                                </MDBBtn>
                            </div>
                        </div>
                    ))}
                </>

            }
        </div>
    )
}