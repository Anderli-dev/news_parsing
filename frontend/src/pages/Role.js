import {useParams} from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import {useEffect, useState} from "react";

export function Role(){
    const [permissions, setPermissions] = useState([]);
    const [isData, setIsData] = useState(false);
    const [formData, setFormData] = useState({
        role_name: "",
    });
    const { role_name } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

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

    function getPermissions(){
        try {
            axios.get(`${process.env.REACT_APP_API_URL}/api/role-permissions/`+id, {
                headers: headers,})
                .then(response => {
                    if (!response.data['role_permissions']) {setIsData(false);}
                    else {setIsData(true); setPermissions(response.data['role_permissions'])}
                })
                .catch(error => console.log(error))
        } catch (err) {
            console.log(err)
        }
    }

    // function onSubmit(){
    //     const data = {
    //         username: username, role: role,
    //     }
    //     try {
    //         axios.put(`${process.env.REACT_APP_API_URL}/api/user/`+id, data,{
    //             headers: headers,})
    //             .then(response => {
    //                 console.log(response)})
    //             .catch(error => console.log(error))
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }

    useEffect(() => {
        getRole();
        getPermissions();
    }, []);

    return(
        <div className='mt-4'>
            <p className='fs-2'>Role №{id}</p>
            <form className='d-inline-flex flex-column'
                  // onSubmit={onSubmit}
            >
                <div className='d-flex align-items-center'>
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
                <div className='d-flex align-items-center mt-3'>
                    <label className='fs-5'>Permissions:</label>
                    <div className='ms-2'>
                        <select className="form-select py-1"
                                // onChange={(e) => setRole(e.target.value)} name='role'
                        >
                            {permissions.map(item => {
                                return <option value={item.name}>{item.name}</option>
                                }
                            )}
                        </select>
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