import {useParams} from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import {useEffect, useState} from "react";

export function User(){
    const [user, setUser] = useState([]);
    //TODO add role id instead role
    const [role, setRole] = useState('')
    const [roles, setRoles] = useState([]);
    const [isData, setIsData] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
    });
    const { username } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('x-access-token'),
        };

    const {id} = useParams();

    function getUser(){
        try {
            axios.get(`${process.env.REACT_APP_API_URL}/api/user/`+id, {
                headers: headers,})
                .then(response => {
                    if (!response.data['user']) {setIsData(false);}
                    else {
                        setIsData(true);
                        setUser(response.data['user']);
                        setFormData({ ...formData, "username": response.data["user"].username});
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
            username: username, role: role,
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

    useEffect(() => {
        getUser();
        getRoles();
    }, []);

    return(
        <div className='mt-4'>
            <p className='fs-2'>User №{user.id}</p>
            <form className='d-inline-flex flex-column' onSubmit={onSubmit}>
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

                <div className="d-flex justify-content-start mt-3">
                    <button type="submit" className="d-flex justify-content-center btn btn-primary btn-block mb-4" style={{width: '150px'}}>
                        Save changes
                    </button>
                </div>
            </form>
        </div>
    )
}