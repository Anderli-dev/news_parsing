import React, {useState} from 'react'
import login_img from '../login.png'
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'
import {setPermissions} from "../store/userPermisions";
import {ErrorLoginModal} from "../components/Modals/ErrorLoginModal";

export function Login(){
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [isError, setIsError] = useState(false)
    const [errMsg, setErrMsg] = useState("")

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { username, password } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const loginSubmit = async e => {
        // user login
        e.preventDefault()
        let headers = {
            'Accept': "application/json",
            'Content-Type': "application/json; charset=UTF-8",
        };

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, {}, {
                    headers: headers,
                    auth: {
                        username: username,
                        password: password
                    }
                }).then(response => {
                    if (response.status === 200) {
                        Cookies.set("x-access-token", response.data['token'])
                        Cookies.set("session", 1)
                        localStorage.setItem('user', username);
                        navigate("/")
                    }
                })
                .catch(async error => {
                    setIsError(false)
                    setIsError(true)
                    setErrMsg(error.response.data.error)
                    setTimeout(() => {!isError&&setIsError(false)}, 5000)
                })

            headers['x-access-token']=Cookies.get('x-access-token')
            await axios.get(`${process.env.REACT_APP_API_URL}/api/user/permissions`,{headers: headers,})
                .then(response => {
                    if (response.status === 200) {
                        dispatch(setPermissions(response.data['user_permissions']))
                    }})
                .catch(error => console.log(error.response))

        } catch (err) {
            console.log(err.response)
        }
    };

    return(
        <div>
            {isError && <ErrorLoginModal errMsg={errMsg}/>}

            <div className="vh-100" style={{backgroundColor: "#202124"}}>
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col col-xl-10">
                            <div className="card py-3" style={{backgroundColor: "", borderRadius: "1rem"}}>
                                <div className="row g-0">
                                    <div className="col-md-6 col-lg-5 d-none d-md-flex ps-3">
                                        <img
                                            src={login_img}
                                            alt="login form" className="img-fluid align-self-center"
                                            style={{borderRadius: "1rem 0 0 1rem"}}/>
                                    </div>
                                    <div className="col-md-6 col-lg-7 d-flex align-items-center">
                                        <div className="card-body p-4  text-black ps-4 pe-5 py-lg-5">
                                            <form onSubmit={loginSubmit}>
                                                <div className="d-flex align-items-center mb-3 pb-1">
                                                    {/*<i className="fas fa-cubes fa-2x me-3" style={{color: "#2a86e7"}}></i>*/}
                                                    <span className="h1 fw-bold mb-0">News parsing</span>
                                                </div>

                                                <h5 className="fw-normal mb-3 pb-3" style={{letterSpacing: "1px"}}>Sign
                                                    into your account</h5>

                                                <div className="form-outline mb-4 pt-3">
                                                    <input type="text" id="form2Example27"
                                                           value={username}
                                                           onChange={onChange}
                                                           name="username"
                                                           className="form-control form-control-lg"
                                                           style={{border: "1px solid #bdbdbd"}}
                                                           required
                                                    />
                                                    <label className="form-label"
                                                           htmlFor="form2Example27"
                                                           style={{transform: "none", marginTop: "-21px",  marginLeft: "-10px"}}>
                                                        Username</label>
                                                </div>

                                                <div className="form-outline mb-4 pt-2">
                                                    <input
                                                        type="password"
                                                        value={password}
                                                        onChange={onChange}
                                                        name="password"
                                                        className={"form-control form-control-lg"}
                                                        style={{border: "1px solid #bdbdbd"}}
                                                        required
                                                    />
                                                    <label className="form-label"
                                                           style={{transform: "none", marginTop: "-28px", marginLeft: "-10px"}}
                                                           htmlFor="form2Example27">Password</label>
                                                </div>

                                                <div className="pt-1 mb-4">
                                                    <button className="btn btn-dark btn-lg btn-block"
                                                            type="submit">Login
                                                    </button>
                                                </div>

                                                <a className="small text-muted" href="/register">Don't have an
                                                    account?</a>
                                                <p className="mb-5 pb-lg-2" style={{color: "#393f81"}}>
                                                    <a href="/register" style={{color: "#393f81"}} className="">Register here!</a>
                                                </p>
                                            </form>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}