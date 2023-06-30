import {useNavigate, useParams} from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import React, {useEffect, useRef, useState} from "react";
import {PermissionsModal} from '../components/PrermissionsModal'
import {AiOutlineEdit, AiOutlineMenuUnfold} from "react-icons/ai";
import {CreateWhiteIco} from "../actions/CreateWhiteIco";
import {switchPermission} from "../actions/SwitchPermission";
import {MDBCard, MDBCardBody, MDBCardHeader, MDBCardText, MDBCardTitle} from "mdb-react-ui-kit";
import '../static/css/description-textarea.css'
import TextareaAutosize from 'react-textarea-autosize';

export function Role(){
    const [rolePermissions, setRolePermissions] = useState([]);
    const [notAppliedPermissions, setNotAppliedPermissions] = useState([]);
    const [centredModal, setCentredModal] = useState(false);
    const [isDescEdit, setIsDescEdit] = useState(false);
    const [formData, setFormData] = useState({
        role_name: "",
        role_users: 0,
        role_description:"",
    });
    const { role_name, role_users, role_description } = formData;

    const [isRoleLoading, setIsRoleLoading] = useState(true);
    const [isPermLoading, setIsPermLoading] = useState(true);

    const navigate = useNavigate()

    const {id} = useParams();


    const [nameIsChanged, setNameIsChanged] = useState(false)
    const [descIsChanged, setDescIsChanged] = useState(false)

    const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('x-access-token'),
        };

    const onNameChange = e => {
        setNameIsChanged(true)
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    const textareaRef = useRef(null);
    const onDescChange = e => {
        setDescIsChanged(true)
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function switchToApplied(e, id) {
        switchPermission(e, id, notAppliedPermissions, setNotAppliedPermissions, rolePermissions, setRolePermissions)
    }

    function switchToNotApplied(e, id) {
        switchPermission(e, id, rolePermissions, setRolePermissions, notAppliedPermissions, setNotAppliedPermissions)
    }

    function getRole(){
        try {
            axios.get(`${process.env.REACT_APP_API_URL}/api/role/`+id, {
                headers: headers,})
                .then(response => {
                    if (!response.data['role']) {setIsRoleLoading(true);}
                    else {
                        setIsRoleLoading(false);
                        setFormData({ ...formData,
                            "role_name": response.data["role"].name,
                            "role_users": response.data["role"].role_users,
                            "role_description": response.data["role"].description});
                    }
                })
                .catch(error => console.log(error))
        } catch (err) {
            console.log(err)
        }
    }

    function getRolePermissions(){
        try {
            axios.get(`${process.env.REACT_APP_API_URL}/api/role-permissions/`+id, {
                headers: headers,})
                .then(response => {
                    if (!response.data['role_permissions'] && !response.data['not_applied_permissions']) {
                        setIsPermLoading(true);
                    }
                    else {
                        setIsPermLoading(false);
                        setRolePermissions(response.data['role_permissions']);
                        setNotAppliedPermissions(response.data['not_applied_permissions']);
                    }
                })
                .catch(error => console.log(error))
        } catch (err) {
            console.log(err)
        }
    }

    const toggleShow = () => setCentredModal(!centredModal);

    function onSubmit(){
        let data = {
            role_id: id,
            role_permissions: rolePermissions
        }
        try {
            axios.post(`${process.env.REACT_APP_API_URL}/api/role-permissions`, data,{
                headers: headers,})
                .then(response => {
                    console.log(response)})
                .catch(error => console.log(error))
        } catch (err) {
            console.log(err)
        }

        if(nameIsChanged || descIsChanged) {
            data = {}
            if (nameIsChanged) {
                data.role_name = role_name
            }
            if (descIsChanged) {
                data.description = role_description
            }
            try {
                axios.put(`${process.env.REACT_APP_API_URL}/api/role/`+id, data,{
                    headers: headers,})
                    .then(response => {
                        console.log(response)})
                    .catch(error => console.log(error))
            } catch (err) {
                console.log(err)
            }
        }
    }

    const delRole = () => {
        try {
            axios.delete(`${process.env.REACT_APP_API_URL}/api/role/`+id,{
                headers: headers,})
                .then(response => {
                    console.log(response); navigate("/roles")})
                .catch(error => console.log(error))
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getRole();
        getRolePermissions();
    }, []);

    return(
        <div className='mt-4'>
            <p className='fs-2'>Role №{id}</p>
            <div className="d-flex justify-content-between">
                <form className='d-flex flex-column justify-content-between'
                      onSubmit={onSubmit}
                >
                    <div className='d-flex flex-column placeholder-glow'>
                        <div className='d-flex align-items-top'>
                            <label className='m-0 fs-5 me-2'>Role:</label>
                            <fieldset className={isRoleLoading&&"placeholder"}>
                                <input type="text"
                                       className='form-control'
                                       name="role_name"
                                       value={isRoleLoading?"Loading...":role_name}
                                       onChange={isRoleLoading? null :onNameChange}
                                />
                            </fieldset>
                        </div>
                        <div>
                            <div className='mt-3'>
                                <button type="button"
                                        onClick={toggleShow}
                                        disabled={isPermLoading && true}
                                        className='m-0 ms-1 w-100 h-100 align-self-end d-flex justify-content-center btn btn-outline-light'
                                >
                                    <p className='m-0 me-2'>Open permissions menu</p>
                                    {CreateWhiteIco(<AiOutlineMenuUnfold size={'1.7em'}/>)}
                                </button>
                            </div>
                            <div className='ms-2 d-flex h-100'>
                                <PermissionsModal
                                    centredModal={centredModal}
                                    setCentredModal={setCentredModal}
                                    toggleShow={toggleShow}

                                    notAppliedPermissions={notAppliedPermissions}
                                    rolePermissions={rolePermissions}

                                    switchToApplied={switchToApplied}
                                    switchToNotApplied={switchToNotApplied}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                        <button type="submit" className="btn btn-primary" style={{width: '150px'}} disabled={isRoleLoading&&true}>
                            Save changes
                        </button>
                    </div>
                </form>

                <div className="d-flex flex-column justify-content-between w-25">
                    <MDBCard background='light' className='text-black placeholder-glow' >
                        <MDBCardHeader>Role Info</MDBCardHeader>
                        <MDBCardBody className="pb-3">
                            <MDBCardTitle className="fs-5 m-0 mb-1">Role users count:</MDBCardTitle>
                            <MDBCardText className={isRoleLoading?"placeholder w-50 mb-2":"mb-2"}>
                                {role_users}
                            </MDBCardText>

                            <MDBCardTitle className="fs-5 m-0 d-flex mb-1">
                                {!isRoleLoading &&

                                    <button className="border-0 p-0 pe-1"
                                            style={{backgroundColor: "inherit"}}
                                            onClick={async () => {
                                                // using await for display textarea and after this set focus
                                                await setIsDescEdit(!isDescEdit);
                                                if (!isDescEdit) {
                                                    // if edit description set focus to end of text
                                                    textareaRef.current.setSelectionRange(
                                                        textareaRef.current.value.length,
                                                        textareaRef.current.value.length)
                                                    textareaRef.current.focus()
                                                }
                                            }
                                            }
                                    >
                                        <AiOutlineEdit style={{marginTop: '-2px'}}/>
                                    </button>
                                }
                                <p className="m-0">Description:</p>
                            </MDBCardTitle>
                                {isDescEdit ?
                                    <>
                                        <TextareaAutosize
                                            rows={1}
                                            ref={textareaRef}
                                            name="role_description"
                                            onChange={onDescChange}
                                            defaultValue={role_description}
                                            className="clear-textarea"
                                        />
                                    </>
                                    :
                                    <MDBCardText className={isRoleLoading?"placeholder w-50 mb-2":"mb-2"}>
                                        {role_description}
                                    </MDBCardText>
                                }
                        </MDBCardBody>
                    </MDBCard>
                    <div className="d-flex justify-content-end">
                    <button type="button"
                            className="btn btn-danger mt-4"
                            style={{width: '150px'}}
                            onClick={delRole}
                            disabled={isRoleLoading&&true}
                    >
                        Delete role
                    </button>
                    </div>
                </div>
            </div>
        </div>
    )
}