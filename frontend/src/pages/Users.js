import React, {useEffect, useState} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {MDBInput} from "mdb-react-ui-kit";
import {BsSearch} from "react-icons/bs";
import {CreateWhiteIco} from "../actions/CreateWhiteIco";
import {BiReset} from "react-icons/bi";
import {useDispatch, useSelector} from "react-redux";
import {setTab} from "../store/sideNavTab";
import {RotatingLines} from "react-loader-spinner";


export function Users(props){
    const [users, setUsersList] = useState([]);
    const [isData, setIsData] = useState(false);
    const [isSearch, setIsSearch] =  useState(true);
    const [searchUserName, setSearchUserName] = useState("")

    const tabKey = useSelector((state) => state.tabsKey.tabs.users)
    const dispatch = useDispatch()

    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('x-access-token'),
    };

    const handleKeyDown = e => {
        if (e.key === 'Enter') {
            searchUsers()
            setIsSearch(true)
        }
    }

    function getUsers(){

        try {
            axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
                headers: headers,})
                .then(response => {
                    if (!response.data['users'].length) {setIsData(false);}
                    else {setIsData(true);setIsSearch(false); setUsersList(response.data['users'])}
                })
                .catch(error => console.log(error))
        } catch (err) {
            console.log(err)
        }
    }

    const searchUsers = () =>{
        const data = {
            username:searchUserName
        }
        try {
            axios.post(`${process.env.REACT_APP_API_URL}/api/user/search`, data, {
                headers: headers,})
                .then(response => {
                    if (!response.data['users'].length) {setIsData(false);}
                    else {setIsSearch(false); setUsersList(response.data['users'])}
                })
                .catch(error => console.log(error))
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        dispatch(setTab(tabKey))
        getUsers();
    }, []);

    return(
        <div className="mt-4">
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
                                onClick={()=>{searchUsers();setIsSearch(true)}}>{CreateWhiteIco(<BsSearch size={'1.5em'}/>)}</button>
                        <button style={{border: "none", backgroundColor: "inherit"}}
                                className="p-0 ps-1"
                                onClick={()=>{getUsers();setIsSearch(true)}}>{CreateWhiteIco(<BiReset size={'1.5em'}/>)}</button>
                    </div>
                </div>
            </div>

            <div className="table table-hover" style={{color: "white"}}>

                <div>
                    <div className="d-flex justify-content-between">
                        <div className="d-flex ps-3">
                            <div className='m-0 pe-3'>#</div>
                            <div className='m-0 ps-3'>Username</div>
                        </div>
                        <div>Role</div>
                    </div>
                </div>

                {isSearch?
                    <div className={"d-flex align-items-center justify-content-center pt-3"} style={{height: "60vh"}}>
                        <RotatingLines
                            strokeWidth="5"
                            strokeColor="#3B71CA"
                            animationDuration="0.75"
                            width="100"
                            visible={true}
                        />
                    </div>
                    :
                    <div className="table-group-divider">
                        {
                            users.map(item =>
                                (
                                    <a key={item.id} href={'user/'+item.id} className="w-100" style={{display: "contents", }}>
                                        <div
                                            className="d-flex p-0 flex-column"
                                            style={{color: "white"}}
                                        >
                                            <div className="d-flex justify-content-between">
                                                <div className="d-flex">
                                                    <p className='m-0 p-3'>{item.id}</p>
                                                    <p className='m-0 p-3'>{item.username}</p>
                                                </div>
                                                <p className='m-0 p-3'>{item.role}</p>
                                            </div>
                                            <span className="align-self-center" style={{backgroundColor: "#757575", height:"1px", width: "100%"}}/>
                                        </div>
                                    </a>
                                )
                            )
                        }
                    </div>
                }
            </div>
        </div>
    )
}