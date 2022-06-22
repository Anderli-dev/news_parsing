import React, {useState} from "react";
import Cookies from "js-cookie";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import login_img from '../login.jpg'


export function Register(props) {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        re_password: ""
    });
    const navigate = useNavigate()

    const { username, password, re_password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const regSubmit = async e => {
        // user register
        e.preventDefault()
        const headers = {
            'Accept': "application/json",
            'Content-Type': "application/json; charset=UTF-8",
        };
        const body = {username: username, password: password, re_password: re_password}
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/register`, body,{
                    headers: headers,
                })
                .then(response => {
                    if (response.status === 200) {
                        // set username for using in navbar
                        localStorage.setItem('user', username);

                        // set logged_in for using in home show is auth content
                        Cookies.set("x-access-token", response.data['token'])
                        navigate("/")
                    }
                })
                .catch(error => console.log(error.response))
        } catch (err) {
            console.log(err)
        }
    };

    return (
        <section className="h-100 bg-dark">
            <div className="container  h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col">
                        <div className="card card-registration my-4">
                            <div className="row g-0">
                                <div className="col-xl-6 d-none d-xl-block">
                                    <img
                                        src={login_img}
                                        alt="login" className="img-fluid"
                                        style={{borderTopLeftRadius: ".25rem", borderBottomLeftRadius: ".25rem"}}/>
                                </div>
                                <div className="col-xl-6">
                                    <div className="card-body p-md-5 text-black">
                                        <form onSubmit={regSubmit}>
                                            <h3 className="mb-5 text-uppercase">Account registration</h3>

                                            <div className="row">
                                                <div className="col-md-6 mb-4">
                                                    <div className="form-outline">
                                                        <input type="text" id="form2Example27"
                                                           value={username}
                                                           onChange={onChange}
                                                           name="username"
                                                           className="form-control form-control-lg"
                                                           style={{border: "1px solid #bdbdbd"}}/>
                                                    <label className="form-label"
                                                           htmlFor="form2Example27"
                                                           style={{transform: "none", marginTop: "-35px",  marginLeft: "-10px"}}>
                                                        Username</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-4">
                                                    <div className="form-outline">
                                                        <input type="password" id="form2Example28"
                                                           value={password}
                                                           onChange={onChange}
                                                           name="password"
                                                           className="form-control form-control-lg"
                                                           style={{border: "1px solid #bdbdbd"}}/>
                                                    <label className="form-label"
                                                           htmlFor="form2Example27"
                                                           style={{transform: "none", marginTop: "-35px",  marginLeft: "-10px"}}>
                                                        Password</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-4 ms-auto">
                                                    <div className="form-outline">
                                                        <input type="password" id="form2Example29"
                                                               value={re_password}
                                                               onChange={onChange}
                                                               name="re_password"
                                                               className="form-control form-control-lg"
                                                               style={{border: "1px solid #bdbdbd"}}/>
                                                        <label className="form-label"
                                                               htmlFor="form2Example27"
                                                               style={{transform: "none", marginTop: "-35px",  marginLeft: "-10px"}}>
                                                            Repeat password</label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="d-flex justify-content-end pt-3">
                                                <button type="submit" className="btn btn-warning btn-lg ms-2">
                                                    Submit
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}