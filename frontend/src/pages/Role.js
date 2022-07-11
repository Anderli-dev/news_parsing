import {useParams} from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import {useEffect, useState} from "react";
import {PermissionsModal} from '../components/PrermissionsModal'
import {AiOutlinePlus} from "react-icons/ai";
import {CreateWhiteIco} from "../actions/CreateWhiteIco";
import {switchPermission} from "../actions/SwitchPermission";
import {Scrollbars} from "react-custom-scrollbars"


export function Role(){
    const [rolePermissions, setRolePermissions] = useState([]);
    const [notAppliedPermissions, setNotAppliedPermissions] = useState([]);
    const [centredModal, setCentredModal] = useState(false);
    const [isData, setIsData] = useState(false);
    const [formData, setFormData] = useState({
        role_name: "",
    });
    const { role_name } = formData;
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

    useEffect(() => {
        getRole();
        getRolePermissions();
    }, []);

    return(
        <div className='mt-4'>
            <p className='fs-2'>Role №{id}</p>
            <form className=''
                  onSubmit={onSubmit}
            >
                <div className='d-flex flex-row align-items-top'>
                    <div className='d-flex align-items-top'>
                        <label className='m-0 fs-5'>Role:</label>
                        <fieldset disabled>
                            <input type="text"
                                   className='form-control ms-2'
                                   name="role"
                                   value={role_name}
                                   onChange={onChange}
                            />
                        </fieldset>
                    </div>
                    <div className='d-flex ms-4'>
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
                </div>

                <div className="d-flex justify-content-start mt-3">
                    <button type="submit" className="d-flex justify-content-center btn btn-primary btn-block mb-4" style={{width: '150px'}}>
                        Save changes
                    </button>
                </div>
            </form>
        </div>
    )
}