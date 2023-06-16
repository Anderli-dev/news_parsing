import React, {useEffect, useState} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {MDBInput} from "mdb-react-ui-kit";
import {BsSearch} from "react-icons/bs";
import {CreateWhiteIco} from "../actions/CreateWhiteIco";
import {BiReset} from "react-icons/bi";


export function Users(){
    // TODO add search
    const [users, setUsersList] = useState([]);
    const [isData, setIsData] = useState(false);
    const [searchUserName, setSearchUserName] = useState("")

    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('x-access-token'),
    };

    const handleKeyDown = e => {
        if (e.key === 'Enter') {
            searchUsers()
        }
    }
    function getUsers(){

        try {
            axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
                headers: headers,})
                .then(response => {
                    if (!response.data['users'].length) {setIsData(false);}
                    else {setIsData(true); setUsersList(response.data['users'])}
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
                    else {setUsersList(response.data['users'])}
                })
                .catch(error => console.log(error))
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
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
                                onClick={searchUsers}>{CreateWhiteIco(<BsSearch size={'1.5em'}/>)}</button>
                        <button style={{border: "none", backgroundColor: "inherit"}}
                                className="p-0 ps-1"
                                onClick={getUsers}>{CreateWhiteIco(<BiReset size={'1.5em'}/>)}</button>
                    </div>
                </div>
            </div>

            <div className='d-flex align-items-center justify-content-between'>
                <div className='d-flex'>
                    <div><p className='ms-3'>#</p></div>
                    <div><p className='ms-3'>Username</p></div>
                </div>
                <div style={{width: '60px'}}><p className='me-3'>Role</p></div>
            </div>
            {
                users.map(item =>
                    (
                        <a href={'user/'+item.id}>
                            <div
                                key={item.id}
                                className='mb-3 d-flex align-items-center justify-content-between'
                                style={{backgroundColor: '#fff', height: '48px'}}>
                                <div className='d-flex'>
                                    <div><p style={{color:'#000'}} className='m-0 ms-3'>{item.id}</p></div>
                                    <div><p style={{color:'#000'}} className='m-0 ms-3'>{item.username}</p></div>
                                </div>
                                <div style={{width: '60px'}} className=''><p style={{color:'#000'}} className='m-0 me-3'>{item.role}</p></div>
                            </div>
                        </a>
                    )
                )
            }
        </div>
    )
}