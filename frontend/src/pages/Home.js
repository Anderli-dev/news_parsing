import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    MDBBtn,
    MDBCardBody,
    MDBCardImage,
    MDBCardText,
    MDBCardTitle,
    MDBPagination,
    MDBPaginationItem
} from "mdb-react-ui-kit";
import moment from 'moment';
import {MdArrowForward, MdFacebook, MdShare} from "react-icons/md";
import {SiTwitter} from "react-icons/si";
import Cookies from "js-cookie";
import {setTab} from "../store/sideNavTab";
import {useDispatch, useSelector} from "react-redux";
import {HomeLoadingPost} from "../components/HomeLoadingPost";
import {OverlayTrigger} from "react-bootstrap";
import {overlay} from "../components/ShareBtnOverlay";

export function Home(){
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isData, setIsData] = useState(false);

    const [paginationData, setPaginationData] = useState({
        page_count: 1,
        page: 1,
        has_next: false,
        has_prev: false,
    })
    const { page_count, page, has_next, has_prev } = paginationData;

    const tabKey = useSelector((state) => state.tabsKey.tabs.home)
    const dispatch = useDispatch()

    const PaginationNav = () => {
        const pages = Array.from({ length: page_count }, (_, index) => (
            <>
                {index+1 === page ?
                    <MDBPaginationItem aria-current='page'>
                        <MDBBtn floating >
                            {index+1}
                        </MDBBtn>
                    </MDBPaginationItem>
                    :
                    <MDBPaginationItem>
                        <MDBBtn floating outline  onClick={()=> getPosts(index+1)}>{index+1}</MDBBtn>
                    </MDBPaginationItem>
                }
            </>
        ));

        return(
            <>
                <nav className="w-25 mb-4">
                    <MDBPagination className='mb-0 justify-content-around'>
                        {page_count > 5 ?
                            <>
                                <MDBPaginationItem onClick={()=> {has_prev && getPosts(page-1)}}>
                                    <MDBBtn floating color='light' disabled={!has_prev}>
                                        «
                                    </MDBBtn  >
                                </MDBPaginationItem>

                                {page !==1 &&
                                    <MDBPaginationItem>
                                        <MDBBtn floating outline onClick={() => {
                                            getPosts(1)
                                        }}>1</MDBBtn>
                                    </MDBPaginationItem>
                                }

                                {(has_prev && page !==2 && page !==3)
                                    ?
                                    <MDBPaginationItem>
                                        <MDBBtn floating outline style={{border: "none", color: "white"}}>...</MDBBtn>
                                    </MDBPaginationItem>
                                    : (has_prev && page === 3) &&
                                    <MDBPaginationItem>
                                        <MDBBtn floating outline  onClick={()=> getPosts(page-1)}>{page-1}</MDBBtn>
                                    </MDBPaginationItem>
                                }


                                {(!has_next) ?
                                    <>
                                        <MDBPaginationItem>
                                            <MDBBtn floating outline  onClick={()=> getPosts(page_count-2)}>{page_count-2}</MDBBtn>
                                        </MDBPaginationItem>
                                        <MDBPaginationItem>
                                            <MDBBtn floating outline  onClick={()=> getPosts(page_count-1)}>{page_count-1}</MDBBtn>
                                        </MDBPaginationItem>
                                    </>
                                    :(has_next && page === page_count-1) &&
                                    <MDBPaginationItem>
                                        <MDBBtn floating outline  onClick={()=> getPosts(page_count-2)}>{page_count-2}</MDBBtn>
                                    </MDBPaginationItem>
                                }

                                <MDBPaginationItem aria-current='page'>
                                    <MDBBtn floating >
                                        {page}
                                    </MDBBtn>
                                </MDBPaginationItem>

                                {(!has_prev) ?
                                    <>
                                        <MDBPaginationItem>
                                            <MDBBtn floating outline  onClick={()=> getPosts(page+1)}>{page+1}</MDBBtn>
                                        </MDBPaginationItem>
                                        <MDBPaginationItem>
                                            <MDBBtn floating outline  onClick={()=> getPosts(page+2)}>{page+2}</MDBBtn>
                                        </MDBPaginationItem>
                                    </>
                                    :(has_prev && page === 2) &&
                                    <MDBPaginationItem>
                                        <MDBBtn floating outline  onClick={()=> getPosts(page+1)}>{page+1}</MDBBtn>
                                    </MDBPaginationItem>
                                }

                                {(has_next && page !==page_count-1 && page !==page_count-2)
                                    ?
                                    <MDBPaginationItem>
                                        <MDBBtn floating outline style={{border: "none", color: "white"}}>...</MDBBtn>
                                    </MDBPaginationItem>
                                    : (has_next && page === page_count-2) &&
                                    <MDBPaginationItem>
                                        <MDBBtn floating outline  onClick={()=> getPosts(page_count-1)}>{page_count-1}</MDBBtn>
                                    </MDBPaginationItem>
                                }

                                {page !==page_count  &&
                                    <MDBPaginationItem>
                                        <MDBBtn floating outline  onClick={()=> getPosts(page_count)}>{page_count}</MDBBtn>
                                    </MDBPaginationItem>
                                }

                                <MDBPaginationItem onClick={()=> {has_next && getPosts(page+1)}}>
                                    <MDBBtn floating color='light' disabled={!has_next}>
                                        »
                                    </MDBBtn>
                                </MDBPaginationItem>
                            </>
                            :
                            <>
                                <MDBPaginationItem onClick={()=> {has_prev && getPosts(page-1)}}>
                                    <MDBBtn floating color='light' disabled={!has_prev}>
                                        «
                                    </MDBBtn  >
                                </MDBPaginationItem>

                                {pages}

                                <MDBPaginationItem onClick={()=> {has_next && getPosts(page+1)}}>
                                    <MDBBtn floating color='light' disabled={!has_next}>
                                        »
                                    </MDBBtn>
                                </MDBPaginationItem>
                            </>
                        }
                    </MDBPagination>
                </nav>
            </>
        )
    }

    function getPosts(current_page){
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('x-access-token'),
        }
        try {
            axios.get(`${process.env.REACT_APP_API_URL}/api/posts?page=` + current_page, {
                headers: headers,})
                .then(response => {
                    if (!response.data['posts'].length && response.status === 200) {setIsData(false);}
                    else {
                        setIsData(true)
                        setPosts(response.data['posts'])
                        setPaginationData({...paginationData,
                            page_count: response.data['page_count'],
                            page: response.data['page'],
                            has_next: response.data['has_next'],
                            has_prev: response.data['has_prev']
                        })
                    }
                    setIsLoading(false)
                })
                .catch(error => console.log(error))
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        dispatch(setTab(tabKey))
        getPosts(page);
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
                    {isData?
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

                                    <div className={item.post_id && "d-flex"}>
                                        <MDBCardImage className="img-fluid"
                                                      src={"uploads/"+item.img}
                                                      style={item.post_id ? {height: "200px", width: "350px"} : {height: "450px"}}/>

                                        <MDBCardBody className={item.post_id ? "py-0 pe-0" : "p-0 pt-4 pb-4"}>

                                            <MDBCardText style={item.post_id ? {whiteSpace: "none"} :{whiteSpace: "pre-line"}}>
                                                {item.preview}
                                            </MDBCardText>

                                            {item.post_id &&
                                                <MDBBtn href={'post/'+item.post_id} className='px-3'>
                                                    <div className='d-flex'>
                                                        <p className='m-0 me-2'>Read more</p>
                                                        <MdArrowForward size={"1.5em"} style={{marginTop: '-1px'}}/>
                                                    </div>
                                                </MDBBtn>
                                            }
                                        </MDBCardBody>

                                    </div>

                                    <div className="d-flex">
                                        <OverlayTrigger trigger="click" overlay={overlay}>
                                            <MDBBtn  className="m-0 mt-3 me-2 p-0 d-flex align-items-center"
                                                     style={{height:'30px'}}>
                                                <SiTwitter className="mx-2"/>
                                            </MDBBtn>
                                        </OverlayTrigger>
                                        <OverlayTrigger trigger="click" overlay={overlay}>
                                            <MDBBtn  className="m-0 mt-3 me-2 p-0 d-flex align-items-center"
                                                     style={{height:'30px'}}>
                                                <MdFacebook className="mx-2"/>
                                            </MDBBtn>
                                        </OverlayTrigger>
                                        <OverlayTrigger trigger="click" overlay={overlay}>
                                            <MDBBtn  className="m-0 mt-3 me-2 p-0 d-flex align-items-center"
                                                     style={{height:'30px'}}
                                            >
                                                <MdShare className="mx-2"/>
                                                <p className="m-0 me-3">Share</p>
                                            </MDBBtn>
                                        </OverlayTrigger>
                                    </div>
                                </div>
                            ))
                            }
                            <PaginationNav/>
                        </>
                        :
                        <>
                            <p className="h2 mt-5">There is no news yet!</p>
                            <p className="h2">-_-'</p>
                        </>
                    }
                </>
            }
        </div>
    )
}