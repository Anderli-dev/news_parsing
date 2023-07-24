import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {MDBInput} from "mdb-react-ui-kit";
import {CreateWhiteIco} from "../actions/CreateWhiteIco";
import {BsSearch} from "react-icons/bs";
import {BiReset} from "react-icons/bi";
import {setTab} from "../store/sideNavTab";
import {useDispatch, useSelector} from "react-redux";
import {InfinitySpin} from "react-loader-spinner";

export function Posts(){
    const [posts, setPostsList] = useState([])
    const [isLoading, setIsLoading] =  useState(true)
    const [isSearching, setIsSearching] = useState(false)
    const [hasNext, setHasNext] = useState(true)
    const [searchTitle, setSearchTitle] = useState("")
    const [page, setPage] = useState(1)
    const [per_page, setPerPage] = useState(5)

    const observerTarget = useRef(null);

    const tabKey = useSelector((state) => state.tabsKey.tabs.posts)
    const dispatch = useDispatch()

    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('x-access-token'),
    };

    const handleKeyDown = e => {
        if (e.key === 'Enter') {
            setPage(1);
            setIsSearching(true)
            searchPosts(1)
        }
    }

    const getPosts = (page) => {
        try{
            axios.get(`${process.env.REACT_APP_API_URL}/api/posts_preview?page=${page}&per_page=${per_page}`, {
                headers: headers,})
                .then(response => {
                    if (!response.data['posts'].length) {setIsLoading(true)}
                    else {
                        setIsLoading(false);
                        setHasNext(response.data['has_next'])
                        if(page === 1){
                            setPostsList([...response.data['posts']])
                        } else {
                            setPostsList(prevItems => [...prevItems, ...response.data['posts']]);
                        }
                        setPage(prevPage => prevPage+1)
                    }
                })
                .catch(error => console.log(error))
        } catch (err) {
            console.log(err)
        }
    }

    const searchPosts = (page) =>{
        const data = {
            title:searchTitle
        }
        try {
            axios.post(`${process.env.REACT_APP_API_URL}/api/post/search?page=${page}&per_page=${per_page}`, data, {
                headers: headers,})
                .then(response => {
                    if (!response.data['posts'].length) {setIsLoading(true)}
                    else {
                        setIsLoading(false);
                        setHasNext(response.data['has_next'])
                        if(page === 1){
                            setPostsList([...response.data['posts']])
                        } else {
                            setPostsList(prevItems => [...prevItems, ...response.data['posts']]);
                        }
                        setPage(prevPage => prevPage+1)
                    }
                })
                .catch(error => console.log(error))
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        dispatch(setTab(tabKey))

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    if(hasNext) {
                        if (!isSearching) {
                            getPosts(page);
                        }
                        else {
                            searchPosts(page)
                        }
                    }
                }
            },
            { threshold: 1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };

    }, [observerTarget, page]);

    return(
        <div className="mt-4 mb-5">
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
                            onClick={()=>{
                                setPage(1);
                                setIsSearching(true)
                                searchPosts(1)
                            }}
                    >{CreateWhiteIco(<BsSearch size={'1.5em'}/>)}</button>

                    <button style={{border: "none", backgroundColor: "inherit"}}
                            className="p-0 ps-1"
                            onClick={()=>{
                                setPage(1)
                                setIsSearching(false)
                                getPosts(1)
                            }}
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

            {isLoading?
                <div className="d-flex flex-column align-items-center justify-content-center" >
                    <InfinitySpin
                        width='150'
                        color="#3B71CA"
                    />
                </div>
                :
                <>
                    {
                        posts.map(item => (
                                <a href={'post/' + item.preview_id + '/edit'} key={item.preview_id}>
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
            <div ref={observerTarget}></div>
        </div>
    )
}