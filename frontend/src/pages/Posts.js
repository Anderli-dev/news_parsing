import React, {useEffect, useState} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {MDBInput} from "mdb-react-ui-kit";
import {CreateWhiteIco} from "../actions/CreateWhiteIco";
import {BsSearch} from "react-icons/bs";
import {BiReset} from "react-icons/bi";
import {setTab} from "../store/sideNavTab";
import {useDispatch, useSelector} from "react-redux";
import {InfinitySpin} from "react-loader-spinner";
import PostsVirtualizedList from "../components/PostsVirtualizedList";
import '../static/css/posts-page.css'

export function Posts(){
    const [posts, setPostsList] = useState([])

    const [isLoading, setIsLoading] =  useState(true)
    const [hasNext, setHasNext] = useState(true)
    const [isSearching, setIsSearching] = useState(false)
    const [isData, setIsData] = useState(false);

    const [searchTitle, setSearchTitle] = useState("")
    const [page, setPage] = useState(1)
    const [per_page] = useState(15)

    const [sortBy, setSortBy] = useState({number:null, title:null, createDate:null})

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
            searchPosts(1, null)
        }
    }

    const getPosts = (page, orderBy) => {
        let orderByUrl = `&is_order_by=${orderBy===null?"False":"True"}`
        if(orderBy!==null) {
            for(let i in orderBy){
                if(orderBy[i] !== null){
                    orderByUrl = orderByUrl+`&${i}=${orderBy[i]}`
                }
            }
        }

        try{
            axios.get(
                `${process.env.REACT_APP_API_URL}/api/posts_preview?page=${page}&per_page=${per_page}${orderByUrl}`,
                {headers: headers,})
                .then(response => {
                    if (!response.data['posts'].length && response.status === 200) {setIsData(false)}
                    else {
                        setIsData(true)
                        setHasNext(response.data['has_next'])
                        if(page === 1){
                            setPostsList([...response.data['posts']])
                        } else {
                            setPostsList(prevItems => [...prevItems, ...response.data['posts']]);
                        }
                        setPage(prevPage => prevPage+1)
                    }
                    setIsLoading(false)
                })
                .catch(error => console.log(error))
        } catch (err) {
            console.log(err)
        }
    }

    const searchPosts = (page, orderBy) =>{
        let orderByUrl = `&is_order_by=${orderBy===null?"False":"True"}`
        if(orderBy!==null) {
            for(let i in orderBy){
                if(orderBy[i] !== null){
                    orderByUrl = orderByUrl+`&${i}=${orderBy[i]}`
                }
            }
        }

        const data = {
            title:searchTitle
        }
        try {
            axios.post(`${process.env.REACT_APP_API_URL}/api/post/search?page=${page}&per_page=${per_page}${orderByUrl}`, data, {
                headers: headers,})
                .then(response => {
                    if (!response.data['posts'].length && response.status === 200) {setIsData(false)}
                    else {
                        setIsData(true)
                        setHasNext(response.data['has_next'])
                        if(page === 1){
                            setPostsList([...response.data['posts']])
                        } else {
                            setPostsList(prevItems => [...prevItems, ...response.data['posts']]);
                        }
                        setPage(prevPage => prevPage+1)
                    }
                    setIsLoading(false)
                })
                .catch(error => console.log(error))
        } catch (err) {
            console.log(err)
        }
    }

    const onSortClick = (el) =>{
        let sortType = [null, 'desc', 'asc']
        let numOfElement = sortType.indexOf(sortBy[el])

        setSortBy(
            prevObj =>{
                return{
                    ...prevObj,
                    [el]: numOfElement>=2?sortType[0]: sortType[numOfElement+1]
                }
            })

        let orderBy = {...sortBy}
        orderBy[el] = numOfElement>=2?sortType[0]: sortType[numOfElement+1]

        if(!isSearching){getPosts(1, orderBy)}else{searchPosts(1, orderBy)}
    }

    useEffect(() => {
        dispatch(setTab(tabKey))
        getPosts(page, null);
    }, []);

    return(
        <div className="mt-4 mb-5" style={{height: "75%"}}>
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
                                setIsSearching(true);
                                searchPosts(1, null);
                                console.log(sortBy)
                                setSortBy({number:null, title:null, createDate:null})
                            }}
                    >{CreateWhiteIco(<BsSearch size={'1.5em'}/>)}</button>

                    <button style={{border: "none", backgroundColor: "inherit"}}
                            className="p-0 ps-1"
                            onClick={()=>{
                                setPage(1)
                                setIsSearching(false)
                                getPosts(1, null)
                            }}
                    >{CreateWhiteIco(<BiReset size={'1.5em'}/>)}</button>
                </div>
            </div>

            <div className='d-flex align-items-center justify-content-between'>
                <div className='d-flex'>
                    <button
                        onClick={()=>onSortClick('number')}
                        className='border-0 bg-transparent text-white p-0 d-flex'
                    >
                        <p className='ms-3'>#</p>
                        <div className={"triangle ms-1 mt-2 "+ (sortBy.number==='desc'&&"down" || sortBy.number==="asc"&&"up")}></div>
                    </button>
                    <button
                        onClick={()=>onSortClick('title')}
                        className='border-0 bg-transparent text-white p-0 d-flex'
                    >
                        <p className='ms-1'>Post title</p>
                        <div className={"triangle ms-1 mt-2 " + (sortBy.title === 'desc' && "down" || sortBy.title === "asc" && "up")}></div>
                    </button>
                </div>
                <div>
                    <button
                        onClick={()=>onSortClick('createDate')}
                        className='border-0 bg-transparent text-white p-0 d-flex'
                    >
                        <div className={"triangle me-1 mt-2 " + (sortBy.createDate==='desc'&&"down" || sortBy.createDate==="asc"&&"up")}></div>
                        <p className='me-3'>Create date</p>
                    </button>
                </div>

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
                    {isData ?
                        <>
                            <PostsVirtualizedList
                                hasNextPage={hasNext}
                                isNextPageLoading={isLoading}
                                items={posts}
                                loadNextPage={()=>getPosts(page, null)}
                                isSearching={isSearching}
                            />
                        </>
                        :
                        <>
                            <div className="d-flex flex-column align-items-center mt-5">
                                <p className="h3">There is no posts yet!</p>
                                <p className="h3">-_-'</p>
                            </div>
                        </>
                    }
                </>
            }
        </div>
    )
}