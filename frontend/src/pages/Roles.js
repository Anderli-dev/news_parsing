import React, {useEffect, useState} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {MDBBtn} from "mdb-react-ui-kit";


export function Roles(){
    // TODO add search
    const [roles, setRolesList] = useState([]);
    const [isData, setIsData] = useState(false);

    function getRoles(){
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('x-access-token'),
        };
        try {
            axios.get(`${process.env.REACT_APP_API_URL}/api/roles`, {
                headers: headers,})
                .then(response => {
                    if (!response.data['roles'].length) {setIsData(false);}
                    else {setIsData(true); setRolesList(response.data['roles'])}
                })
                .catch(error => console.log(error))
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getRoles();
    }, []);

    return(
        <div className="mt-4">
            <div className="d-flex justify-content-between">
                <h1 className="mb-4">Roles list</h1>
                <MDBBtn href="/role-create" className="mb-4 py-3"><p className="m-0">Add role</p></MDBBtn>
            </div>
            <div className='d-flex'>
                {
                    roles.map(item =>
                        (
                            <a href={'role/'+item.id}>
                                <div
                                    key={item.id}
                                    className='me-3 d-flex align-items-center'
                                    style={{backgroundColor: '#fff', height: '48px'}}>
                                    <div><p style={{color:'#000'}} className='m-0 ms-3 me-3'>{item.name}</p></div>
                                </div>
                            </a>
                        )
                    )
                }
            </div>
        </div>
    )
}