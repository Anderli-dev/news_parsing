import React, {useEffect, useState} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {MDBInput} from "mdb-react-ui-kit";
import {CreateWhiteIco} from "../actions/CreateWhiteIco";
import {BsSearch} from "react-icons/bs";
import {BiReset} from "react-icons/bi";
import {setTab} from "../store/sideNavTab";
import {useDispatch, useSelector} from "react-redux";
import {RotatingLines} from "react-loader-spinner";

export function Posts(){
    const [posts, setPostsList] = useState([]);
    const [isData, setIsData] = useState(false);
    const [isSearch, setIsSearch] =  useState(true);
    const [searchTitle, setSearchTitle] = useState("")

    const tabKey = useSelector((state) => state.tabsKey.tabs.posts)
    const dispatch = useDispatch()

    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('x-access-token'),
    };
    const handleKeyDown = e => {
        if (e.key === 'Enter') {
            searchPosts()
            setIsSearch(true)
        }
    }

    const getPosts = () => {
        try{
            axios.get(`${process.env.REACT_APP_API_URL}/api/posts_preview`, {
                headers: headers,})
                .then(response => {
                    if (!response.data['posts'].length) {setIsData(false);}
                    else {setIsData(true);setIsSearch(false); setPostsList(response.data['posts']);}
                })
                .catch(error => console.log(error))
        } catch (err) {
            console.log(err)
        }
    }

    const searchPosts = () =>{
        const data = {
            title:searchTitle
        }
        try {
            axios.post(`${process.env.REACT_APP_API_URL}/api/post/search`, data, {
                headers: headers,})
                .then(response => {
                    if (!response.data['posts'].length) {setIsData(false);}
                    else {setIsSearch(false); setPostsList(response.data['posts'])}
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
        <div className="mt-4">
            <div className="d-flex justify-content-between">
                <h1 className="mb-1">Posts list</h1>
                <div className="align-self-center">
                    <a href="/post/create" className="btn btn-primary mb-1" role="button">
                        <p className="m-0">Add post</p>
                    </a>
                </div>
            </div>

            <div className="mb-4">
                    <div className="d-flex">

                        <MDBInput label='Search by title'
                                  id='formTextExample1'
                                  type='text'
                                  aria-describedby='textExample1'
                                  contrast
                                  value={searchTitle}
                                  onKeyDown={handleKeyDown}
                                  onChange={e=>setSearchTitle(e.target.value)}
                        />

                        <button style={{border: "none", backgroundColor: "inherit"}}
                                className="ps-2"
                                onClick={()=>{searchPosts();setIsSearch(true)}}
                        >{CreateWhiteIco(<BsSearch size={'1.5em'}/>)}</button>

                        <button style={{border: "none", backgroundColor: "inherit"}}
                                className="p-0 ps-1"
                                onClick={()=>{getPosts();setIsSearch(true)}}
                        >{CreateWhiteIco(<BiReset size={'1.5em'}/>)}</button>
                    </div>
                </div>

            <div className='d-flex align-items-center justify-content-between'>
                <div className='d-flex'>
                    <div><p className='ms-3'>#</p></div>
                    <div><p className='ms-3'>Post title</p></div>
                </div>
                <div><p className='me-3'>Create date</p></div>
            </div>

            {isSearch?
                <div className={"d-flex align-items-center justify-content-center"}>
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
                        posts.map(item => (
                                <a href={'post/' + item.preview_id + '/edit'}>
                                    <div
                                        key={item.preview_id}
                                        className='mb-3 d-flex align-items-center justify-content-between'
                                        style={{backgroundColor: '#fff', height: '48px'}}>
                                        <div className="d-flex">
                                            <div><p style={{color: '#000'}}
                                                    className='m-0 ms-3'>{item.preview_id}</p></div>
                                            <div><p style={{color: '#000'}} className='m-0 ms-3'>{item.title}</p>
                                            </div>
                                        </div>
                                        <div><p style={{color: '#000'}} className='m-0 me-3'>{item.posted_at}</p>
                                        </div>
                                    </div>
                                </a>
                            )
                        )
                    }
                </>
            }
        </div>
    )
}