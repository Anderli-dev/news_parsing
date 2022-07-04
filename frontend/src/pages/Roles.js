import React, {useEffect, useState} from "react";
import axios from "axios";
import Cookies from "js-cookie";


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
            <h1 className="mb-4">Roles list</h1>
            {/*<div className='d-flex align-items-center justify-content-between'>*/}
            {/*    <div className='d-flex'>*/}
            {/*        <div><p className='ms-3'>#</p></div>*/}
            {/*        <div><p className='ms-3'>Name</p></div>*/}
            {/*    </div>*/}
            {/*</div>*/}
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