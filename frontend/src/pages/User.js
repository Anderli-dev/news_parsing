import {useNavigate, useParams} from "react-router-dom";
import React from "react"
import Cookies from "js-cookie";
import axios from "axios";
import {useEffect, useState} from "react";
import {MDBCard, MDBCardBody, MDBCardHeader, MDBCardText, MDBCardTitle, MDBInput} from "mdb-react-ui-kit";

export function User(){
    const [user, setUser] = useState([]);
    //TODO add role id instead role
    const [role, setRole] = useState('')
    const [roles, setRoles] = useState([]);
    const [isData, setIsData] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        name: "",
        surname: "",
        email: "",
    });
    const { username, name, surname, email } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('x-access-token'),
        };

    const {id} = useParams();

    const navigate = useNavigate()

    function getUser(){
        try {
            axios.get(`${process.env.REACT_APP_API_URL}/api/user/`+id, {
                headers: headers,})
                .then(response => {
                    if (!response.data['user']) {setIsData(false);}
                    else {
                        setIsData(true);
                        setUser(response.data['user']);
                        setFormData({ ...formData,
                            "username": response.data["user"].username,
                            "name": response.data["user"].name,
                            "surname": response.data["user"].surname,
                            "email": response.data["user"].email});
                        setRole(response.data['user'].role);
                    }
                })
                .catch(error => console.log(error))
        } catch (err) {
            console.log(err)
        }
    }

    function getRoles(){
        try {
            axios.get(`${process.env.REACT_APP_API_URL}/api/roles`, {
                headers: headers,})
                .then(response => {
                    if (!response.data['roles']) {setIsData(false);}
                    else {setIsData(true); setRoles(response.data['roles'])}
                })
                .catch(error => console.log(error))
        } catch (err) {
            console.log(err)
        }
    }

    function onSubmit(){
        const data = {
            username: username,
            role: role,
            name: name,
            surname: surname,
            email: email
        }
        try {
            axios.put(`${process.env.REACT_APP_API_URL}/api/user/`+id, data,{
                headers: headers,})
                .then(response => {
                    console.log(response)})
                .catch(error => console.log(error))
        } catch (err) {
            console.log(err)
        }
    }

    const onDeleteClick = () =>{
        try {
            axios.delete(`${process.env.REACT_APP_API_URL}/api/user/`+id,{
                headers: headers,})
                .then(response => {
                    console.log(response); navigate("/users")})
                .catch(error => console.log(error))
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getUser();
        getRoles();
    }, []);

    return(
        <div className='mt-4'>
            <p className='fs-2'>User №{user.id}</p>
            <div className="d-flex justify-content-between">
                <form className='d-inline-flex flex-column justify-content-between' onSubmit={onSubmit}>
                    <div className="d-flex">
                        <div className="d-flex flex-column">
                            <MDBInput onChange={onChange} name="name" wrapperClass="mb-3" label='Name' id='typeText' type='text' contrast value={name}/>
                            <MDBInput onChange={onChange} name="surname" wrapperClass="mb-3" label='Surname' id='typeText' type='text' contrast value={surname}/>
                            <MDBInput onChange={onChange} name="email" label='Email' id='typeEmail' type='email' contrast value={email}/>
                        </div>
                        <div className="ms-4">
                            <div className='d-flex align-items-center'>
                                <label className='m-0 fs-5'>Username:</label>
                                <input type="text"
                                       className='form-control ms-2'
                                       name="username"
                                       value={username}
                                       onChange={onChange}
                                       required/>
                            </div>
                            <div className='d-flex align-items-center mt-3'>
                                <label className='fs-5'>Role:</label>
                                <div className='ms-2'>
                                    <select className="form-select py-1" value={role} onChange={(e) => setRole(e.target.value)} name='role'>
                                        {roles.map(item => {
                                                return <option value={item.name}>{item.name}</option>
                                            }
                                        )}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between mt-3">
                        <button type="submit" className="d-flex justify-content-center btn btn-primary btn-block mb-4" style={{width: '150px'}}>
                            Save changes
                        </button>
                    </div>
                </form>
                <div className="w-50 d-flex flex-column ">
                    <div >
                        <MDBCard shadow='0' border='light' style={{backgroundColor: "inherit"}} className='mb-3 '>
                            <MDBCardHeader>Activity info</MDBCardHeader>
                            <MDBCardBody>
                                <MDBCardTitle>Count of posts</MDBCardTitle>
                                <MDBCardText>
                                    {user.count_of_posts}
                                </MDBCardText>
                                <MDBCardTitle>Last posted at</MDBCardTitle>
                                <MDBCardText>
                                    {user.last_posted_at}
                                </MDBCardText>
                            </MDBCardBody>
                        </MDBCard>
                    </div>

                    <div className="d-flex justify-content-end">
                        <button onClick={onDeleteClick} className="btn btn-danger mb-4">
                            Delete user
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}