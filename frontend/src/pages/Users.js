import React from "react";
import axios from "axios";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {MDBTable, MDBTableHead} from "mdb-react-ui-kit";


export function Users(){
    // TODO add search
    const [users, setUsersList] = useState([]);
    const [isData, setIsData] = useState(false);

    function getUsers(){
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('x-access-token'),
        };
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

    useEffect(() => {
        getUsers();
    }, []);

    return(
        <div className="mt-4">
            <h1 className="mb-4">Users list</h1>
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