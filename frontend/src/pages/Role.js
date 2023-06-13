import {useNavigate, useParams} from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {PermissionsModal} from '../components/PrermissionsModal'
import {AiOutlineMenuUnfold} from "react-icons/ai";
import {CreateWhiteIco} from "../actions/CreateWhiteIco";
import {switchPermission} from "../actions/SwitchPermission";
import {MDBCard, MDBCardBody, MDBCardHeader, MDBCardText, MDBCardTitle} from "mdb-react-ui-kit";


export function Role(){
    const [rolePermissions, setRolePermissions] = useState([]);
    const [notAppliedPermissions, setNotAppliedPermissions] = useState([]);
    const [centredModal, setCentredModal] = useState(false);
    const [isData, setIsData] = useState(false);
    const [formData, setFormData] = useState({
        role_name: "",
    });
    const { role_name } = formData;

    const navigate = useNavigate()


    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    function switchToApplied(e, id) {
        switchPermission(e, id, notAppliedPermissions, setNotAppliedPermissions, rolePermissions, setRolePermissions)
    }

    function switchToNotApplied(e, id) {
        switchPermission(e, id, rolePermissions, setRolePermissions, notAppliedPermissions, setNotAppliedPermissions)
    }

    const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('x-access-token'),
        };

    const {id} = useParams();

    function getRole(){
        try {
            axios.get(`${process.env.REACT_APP_API_URL}/api/role/`+id, {
                headers: headers,})
                .then(response => {
                    if (!response.data['role']) {setIsData(false);}
                    else {
                        setIsData(true);
                        setFormData({ ...formData, "role_name": response.data["role"].name});
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
                        setIsData(false);
                    }
                    else {
                        setIsData(true);
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
        // TODO send request when role name changed
        const data = {
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
                    <div className='d-flex flex-column'>
                        <div className='d-flex align-items-top'>
                            <label className='m-0 fs-5'>Role:</label>
                            <fieldset>
                                <input type="text"
                                       className='form-control ms-2'
                                       name="role_name"
                                       value={role_name}
                                       onChange={onChange}
                                />
                            </fieldset>
                        </div>
                        <div>
                            <div className='mt-3'>
                                <button type="button"
                                        onClick={toggleShow}
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
                        <button type="submit" className="btn btn-primary" style={{width: '150px'}}>
                            Save changes
                        </button>
                    </div>
                </form>
                <div className="d-flex flex-column justify-content-between w-25">
                    <MDBCard background='light' className='text-black' >
                        <MDBCardHeader>Role Info</MDBCardHeader>
                        <MDBCardBody>
                            <MDBCardTitle className="fs-5 m-0">Role users count:</MDBCardTitle>
                            <MDBCardText>
                                0000
                            </MDBCardText>
                            <MDBCardTitle className="fs-5 m-0">More info:</MDBCardTitle>
                            <MDBCardText>
                                Bla-Bla-Bla
                            </MDBCardText>
                        </MDBCardBody>
                    </MDBCard>
                    <div className="d-flex justify-content-end">
                    <button type="button"
                            className="btn btn-danger mt-4"
                            style={{width: '150px'}}
                            onClick={delRole}>
                        Delete role
                    </button>
                    </div>
                </div>
            </div>
        </div>
    )
}