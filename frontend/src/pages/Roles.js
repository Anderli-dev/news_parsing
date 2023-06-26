import React, {useEffect, useState} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {setTab} from "../store/sideNavTab";
import {useDispatch, useSelector} from "react-redux";


export function Roles(){
    const [roles, setRolesList] = useState([]);
    const [isData, setIsData] = useState(false);

    const tabKey = useSelector((state) => state.tabsKey.tabs.roles)
    const dispatch = useDispatch()

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
        dispatch(setTab(tabKey))
        getRoles();
    }, []);

    return(
        <div className="mt-4">
            <div className="d-flex justify-content-between mb-4">
                <h1 className="m-0">Roles list</h1>
                <div className="align-self-center">
                    <a href="/role/create" className="btn btn-primary " role="button">
                        <p className="m-0">Add role</p>
                    </a>
                </div>
            </div>
            <div className='d-flex'>
                {
                    roles.map(item =>
                        (
                            <a href={'role/'+item.id}>
                                <div
                                    key={item.id}
                                    className='me-3 d-flex align-items-center btn-light'
                                    style={{ height: '48px'}}
                                    >
                                    <div>
                                        <p className='m-0 ms-3 me-3'>{item.name}</p>
                                    </div>
                                </div>
                            </a>
                        )
                    )
                }
            </div>
        </div>
    )
}