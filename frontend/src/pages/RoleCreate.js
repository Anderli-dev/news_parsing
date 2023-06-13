import React from "react"
import {MDBBtn, MDBInput} from "mdb-react-ui-kit";
import {CreateWhiteIco} from "../actions/CreateWhiteIco";
import {AiOutlinePlus} from "react-icons/ai";
import {Scrollbars} from "react-custom-scrollbars";
import {PermissionsModal} from "../components/PrermissionsModal";
import {useState} from "react";
import {switchPermission} from "../actions/SwitchPermission";
import axios from "axios";
import {useEffect} from "react";
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";

export function RoleCreate(){
    const [rolePermissions, setRolePermissions] = useState([]);
    const [notAppliedPermissions, setNotAppliedPermissions] = useState([]);
    const [centredModal, setCentredModal] = useState(false);
    const [isData, setIsData] = useState(false);
    const [formData, setFormData] = useState({
        role_name: "",
    });
    const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('x-access-token'),
        };

    const { role_name } = formData;

    const navigate = useNavigate()

    const onChange = e => {
        setFormData(
            {...formData, [e.target.name]: e.target.value})
    }

    function switchToApplied(e, id) {
        switchPermission(e, id, notAppliedPermissions, setNotAppliedPermissions, rolePermissions, setRolePermissions)
    }

    function switchToNotApplied(e, id) {
        switchPermission(e, id, rolePermissions, setRolePermissions, notAppliedPermissions, setNotAppliedPermissions)
    }

    const toggleShow = () => setCentredModal(!centredModal);

    function getPermissions(){
        try {
            axios.get(`${process.env.REACT_APP_API_URL}/api/permissions`, {
                headers: headers,})
                .then(response => {
                    if (!response.data['permissions']) {
                        setIsData(false);
                    }
                    else {
                        setIsData(true);
                        setNotAppliedPermissions(response.data['permissions']);
                    }
                })
                .catch(error => console.log(error))
        } catch (err) {
            console.log(err)
        }
    }

    function onSubmit(){
        const data = {
            role_name: role_name,
            role_permissions: rolePermissions
        }
        try {
            axios.post(`${process.env.REACT_APP_API_URL}/api/role`, data,{
                headers: headers,})
                .then(response => {
                    console.log(response);navigate("/roles")})
                .catch(error => console.log(error))
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getPermissions();
    }, []);

    return(
        <div className="mt-4">
            <p className='fs-2'>Create Role</p>
            <form onSubmit={onSubmit}>
                <div className='d-flex align-items-top'>
                    <label className='m-0 fs-5'>Role:</label>
                    <fieldset>
                        {/*TODO add validation*/}
                        <input type="text"
                               className='form-control ms-2'
                               name="role_name"
                               value={role_name}
                               onChange={onChange}
                        />
                    </fieldset>
                </div>

                <div className='d-flex my-3'>
                    <div className='d-flex flex-column'>
                        <label className='fs-5'>Permissions:</label>
                        <button type="button" onClick={toggleShow} className='m-0 ms-1 h-100 align-self-end' style={{backgroundColor: 'inherit', border: 'none'}}>
                            {CreateWhiteIco(<AiOutlinePlus size={'1.7em'}/>)}
                        </button>
                    </div>
                    <div className='ms-2 d-flex h-100'>
                        <Scrollbars style={{width:'200px', height: '10vh'}} className="list-group list-group-numbered py-1">
                            {rolePermissions.map(item => {
                                    return <li className='list-group-item' value={item.name}>{item.name}</li>
                                }
                            )}
                        </Scrollbars>
                        <div>

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

                <div>
                    <MDBBtn type='submit' className="me-2">Submit</MDBBtn>
                    {/*TODO add reset options*/}
                    <MDBBtn type='reset'>Reset</MDBBtn>
                </div>
            </form>
        </div>
    )
}