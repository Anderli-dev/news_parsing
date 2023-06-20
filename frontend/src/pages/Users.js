import React, {useEffect, useState} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {MDBInput} from "mdb-react-ui-kit";
import {BsSearch} from "react-icons/bs";
import {CreateWhiteIco} from "../actions/CreateWhiteIco";
import {BiReset} from "react-icons/bi";


export function Users(){
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

            <table className="table table-hover" style={{color: "white"}}>

                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Username</th>
                        <th scope="col">Role</th>
                    </tr>
                </thead>

                <tbody className="table-group-divider">
                {
                    users.map(item =>
                        (
                            <a href={'user/'+item.id} className="w-100" style={{display: "contents", }}>
                                <tr
                                    key={item.id}
                                    className=""
                                    style={{color: "white"}}
                                >
                                    <th scope="row"><p className='m-0 p-3'>{item.id}</p></th>
                                    <td><p className='m-0 p-3'>{item.username}</p></td>
                                    <td><p className='m-0 p-3'>{item.role}</p></td>
                                </tr>
                            </a>
                        )
                    )
                }
                </tbody>
            </table>
        </div>
    )
}