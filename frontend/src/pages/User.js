import {useNavigate, useParams} from "react-router-dom";
import React from "react"
import Cookies from "js-cookie";
import axios from "axios";
import {useEffect, useState} from "react";
import {MDBCard, MDBCardBody, MDBCardHeader, MDBCardText, MDBCardTitle, MDBInput} from "mdb-react-ui-kit";
import {ValidationField} from "../components/ValidationField";
import {DeleteModal} from "../components/Modals/DeleteModal";

export function User(){
    const [user, setUser] = useState([]);
    //TODO add role id instead role
    const [role, setRole] = useState('')
    const [roles, setRoles] = useState([]);
    const [errorFields, setErrorFields] = useState({});
    const [isUserLoading, setIsUserLoading] = useState(true);
    const [isRolesLoading, setIsRolesLoading] = useState(true);
    const [isDeleteRole, setIsDeleteRole] = useState(false)
    const [formData, setFormData] = useState({
        username: "",
        name: "",
        surname: "",
        email: "",
    });
    const { username, name, surname, email } = formData;

    const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('x-access-token'),
        };

    const {id} = useParams();

    const navigate = useNavigate()

    const onChange = e =>{
        if(e.target.value.length > 50){
            const errMsg =
            ( e.target.name ==='name' && "Name max length 50 symbols!")||
            ( e.target.name ==='surname' && "Surname max length 50 symbols!")||
            ( e.target.name ==='email' && 'Email max length 50 symbols!')||
            ( e.target.name ==='username' && "Username max length 50 symbols!")

            setErrorFields({...errorFields, [e.target.name]: errMsg});
            return
        }
        else if(errorFields[e.target.name]){
            const arr = {...errorFields}
            delete arr[e.target.name]
            setErrorFields({...arr});
        }

        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function getUser(){
        try {
            axios.get(`${process.env.REACT_APP_API_URL}/api/user/`+id, {
                headers: headers,})
                .then(response => {
                    if (!response.data['user']) {setIsUserLoading(true);}
                    else {
                        setIsUserLoading(false);
                        setUser(response.data['user']);
                        setFormData({ ...formData,
                            "username": response.data["user"].username,
                            "name": response.data["user"].name,
                            "surname": response.data["user"].surname,
                            "email": response.data["user"].email});
                        setRole(response.data['user'].role);
                    }
                })
                .catch(error => {console.log(error.response); if(error.response.status === 404){navigate("/users")}})
        } catch (err) {
            console.log(err)
        }
    }

    function getRoles(){
        try {
            axios.get(`${process.env.REACT_APP_API_URL}/api/roles`, {
                headers: headers,})
                .then(response => {
                    if (!response.data['roles']) {setIsRolesLoading(true);}
                    else {setIsRolesLoading(false); setRoles(response.data['roles'])}
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
                .then(()=>{navigate("/users");setIsDeleteRole(false)})
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
                        <div className="d-flex flex-column placeholder-glow">
                            <ValidationField
                                asElement={MDBInput}
                                onChange={isUserLoading? null :onChange}
                                name="name"
                                className={isUserLoading&&"placeholder"}
                                label='Name' id='typeText' type='text' contrast value={name}
                                disabled={isUserLoading}
                                error={errorFields}
                            />
                            <ValidationField
                                asElement={MDBInput}
                                onChange={isUserLoading? null :onChange}
                                name="surname"
                                className={isUserLoading&&"placeholder"}
                                label='Surname' id='typeText' type='text' contrast value={surname}
                                disabled={isUserLoading}
                                error={errorFields}
                            />
                            <ValidationField
                                asElement={MDBInput}
                                onChange={isUserLoading? null :onChange}
                                name="email"
                                className={isUserLoading&&"placeholder"}
                                label='Email' id='typeEmail' type='email' contrast value={email}
                                disabled={isUserLoading}
                                error={errorFields}
                            />
                        </div>

                        <div className="ms-4 placeholder-glow">
                            <div className={errorFields["username"]?'d-flex align-items-center' : 'd-flex align-items-center mb-4'}>
                                <label className='m-0 fs-5 me-2'>Username:</label>
                                <div className={isUserLoading&&"placeholder"}>
                                    <input
                                        type="text"
                                        className='form-control '
                                        name="username"
                                        value={isUserLoading?"Loading...":username}
                                        onChange={isUserLoading? null : onChange}
                                        required
                                    />
                                </div>
                            </div>
                            {errorFields["username"]&&
                                <div style={{color: "#DC4C64", fontSize: "15px"}} >
                                    <p className="m-0">{errorFields["username"]}</p>
                                </div>
                            }

                            <div className='d-flex align-items-center'>
                                <label className='fs-5 me-2'>Role:</label>
                                <div className={isUserLoading&&"placeholder"} >
                                    <select className="form-select py-1 placeholder-glow"
                                            disabled={isRolesLoading&&true}
                                            value={role}
                                            onChange={(e) => isUserLoading? null : setRole(e.target.value)}
                                            name='role'>
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
                        <button type="submit" className="d-flex justify-content-center btn btn-primary btn-block mb-4" disabled={isUserLoading&&true} style={{width: '150px'}}>
                            Save changes
                        </button>
                    </div>

                </form>

                <div className="w-50 d-flex flex-column">
                    <div >
                        <MDBCard shadow='0' border='light' style={{backgroundColor: "inherit"}} className='mb-3 placeholder-glow text-white'>
                            <MDBCardHeader>Activity info</MDBCardHeader>
                            <MDBCardBody>
                                <MDBCardTitle>Count of posts</MDBCardTitle>
                                <MDBCardText className={isUserLoading&&"placeholder w-50"}>
                                    {user.count_of_posts}
                                </MDBCardText>
                                <MDBCardTitle>Last posted at</MDBCardTitle>
                                <MDBCardText className={isUserLoading&&"placeholder w-50"}>
                                    {user.last_posted_at}
                                </MDBCardText>
                            </MDBCardBody>
                        </MDBCard>
                    </div>

                    <div className="d-flex justify-content-end">
                        <button onClick={()=>setIsDeleteRole(true)} disabled={isUserLoading&&true} className="btn btn-danger mb-4">
                            Delete user
                        </button>
                        {isDeleteRole && <DeleteModal onDeleteClick={onDeleteClick} setIsDelete={setIsDeleteRole}/>}
                    </div>
                </div>

            </div>
        </div>
    )
}