import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {MDBInput} from "mdb-react-ui-kit";
import {BsSearch} from "react-icons/bs";
import {CreateWhiteIco} from "../actions/CreateWhiteIco";
import {BiReset} from "react-icons/bi";
import {useDispatch, useSelector} from "react-redux";
import {setTab} from "../store/sideNavTab";
import {InfinitySpin} from "react-loader-spinner";
import UsersVirtualizedList from "../components/UsersVirtualizedList";


export function Users(){
    const [users, setUsersList] = useState([]);
    const [isLoading, setIsLoading] =  useState(true)
    const [isSearching, setIsSearching] = useState(false)
    const [hasNext, setHasNext] = useState(true)
    const [page, setPage] = useState(1)

    const [per_page] = useState(5)
    const [searchUserName, setSearchUserName] = useState("")

    const observerTarget = useRef(null);

    const tabKey = useSelector((state) => state.tabsKey.tabs.users)
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
            searchUsers(1)
        }
    }

    function getUsers(page){
        try {
            axios.get(`${process.env.REACT_APP_API_URL}/api/users?page=${page}&per_page=${per_page}`, {
                headers: headers,})
                .then(response => {
                    if (!response.data['users'].length) {setIsLoading(true)}
                    else {
                        setIsLoading(false);
                        setHasNext(response.data['has_next'])
                        if(page === 1){
                            setUsersList([...response.data['users']])
                        } else {
                            setUsersList(prevItems => [...prevItems, ...response.data['users']]);
                        }
                        setPage(prevPage => prevPage+1)
                    }
                })
                .catch(error => console.log(error))
        } catch (err) {
            console.log(err)
        }
    }

    const searchUsers = (page) =>{
        const data = {
            username:searchUserName
        }
        try {
            axios.post(`${process.env.REACT_APP_API_URL}/api/user/search?page=${page}&per_page=${per_page}`, data, {
                headers: headers,})
                .then(response => {
                    if (!response.data['users'].length) {setIsLoading(true);}
                    else {
                        setIsLoading(false);
                        setHasNext(response.data['has_next'])
                        if(page === 1){
                            setUsersList([...response.data['users']])
                        } else {
                            setUsersList(prevItems => [...prevItems, ...response.data['users']]);
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
        getUsers(page);
    }, []);

    return(
        <div className="mt-4" style={{height: '75%'}}>
            <div className="d-flex mb-4 align-items-center justify-content-between">
                <h1 className="mb-0">Users list</h1>

                <div className="">
                    <div className="d-flex">

                        <MDBInput label='Search by username'
                                  id='formTextExample1'
                                  type='text'
                                  aria-describedby='textExample1'
                                  contrast
                                  value={searchUserName}
                                  onKeyDown={handleKeyDown}
                                  onChange={e=>setSearchUserName(e.target.value)}
                        />
                        <button style={{border: "none", backgroundColor: "inherit"}}
                                className="ps-2"
                                onClick={()=>{
                                    setPage(1)
                                    setIsSearching(true)
                                    searchUsers(1)
                                }}>{CreateWhiteIco(<BsSearch size={'1.5em'}/>)}</button>
                        <button style={{border: "none", backgroundColor: "inherit"}}
                                className="p-0 ps-1"
                                onClick={()=>{
                                    setPage(1)
                                    setIsSearching(false)
                                    getUsers(1)
                                }}>{CreateWhiteIco(<BiReset size={'1.5em'}/>)}</button>
                    </div>
                </div>
            </div>

            <div>
                <div className="d-flex justify-content-between">
                    <div className="d-flex ps-3">
                        <div className='m-0 pe-3'>#</div>
                        <div className='m-0 ps-3'>Username</div>
                    </div>
                    <div className="pe-3">Role</div>
                </div>
            </div>

            <div className="w-100 mt-3" style={{backgroundColor: "#fff", height: "2px"}}></div>

            {isLoading?
                <div className="d-flex flex-column align-items-center justify-content-center" >
                    <InfinitySpin
                        width='150'
                        color="#3B71CA"
                    />
                </div>
                :
                <UsersVirtualizedList
                    hasNextPage={hasNext}
                    isNextPageLoading={isLoading}
                    items={users}
                    loadNextPage={()=>getUsers(page)}
                    isSearching={isSearching}
                />
            }

        </div>
    )
}