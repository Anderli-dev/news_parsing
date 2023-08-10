import React, {useState} from "react";
import Cookies from "js-cookie";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {FaUser} from "react-icons/fa";


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
        <section>
            <div className="container vh-100 d-flex align-items-center justify-content-center">
                <div>
                    <div className="card-body p-md-5 text-black rounded-7" style={{backgroundColor: "#fff"}}>
                        <form onSubmit={regSubmit}>
                            <h3 className="mb-5 text-uppercase">Account registration<FaUser style={{marginTop: "-5px", marginLeft: "5px"}}/></h3>
                            <div className="row">
                                <div className="mb-4 ms-auto">
                                    <div className="form-outline">
                                        <input type="text" id="form2Example27"
                                               value={username}
                                               onChange={onChange}
                                               name="username"
                                               required
                                               className="form-control form-control-lg"
                                               style={{border: "1px solid #bdbdbd"}}/>
                                        <label className="form-label"
                                               htmlFor="form2Example27"
                                               style={{transform: "none", marginTop: "-35px",  marginLeft: "-10px"}}>
                                            Username</label>
                                    </div>
                                </div>
                                <div className="d-flex">
                                    <div className="mb-4 me-3 flex-fill">
                                        <div className="form-outline">
                                            <input type="password" id="form2Example28"
                                                   value={password}
                                                   onChange={onChange}
                                                   name="password"
                                                   required
                                                   className="form-control form-control-lg"
                                                   style={{border: "1px solid #bdbdbd"}}/>
                                            <label className="form-label"
                                                   htmlFor="form2Example27"
                                                   style={{transform: "none", marginTop: "-35px",  marginLeft: "-10px"}}>
                                                Password</label>
                                        </div>
                                    </div>
                                    <div className="mb-4 flex-fill">
                                        <div className="form-outline">
                                            <input type="password" id="form2Example29"
                                                   value={re_password}
                                                   onChange={onChange}
                                                   required
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
                            </div>

                            <div className="d-flex justify-content-between">
                                <div className="d-flex flex-column justify-content-end pt-3">
                                    <a className="small text-muted" href="/register">Don't have an
                                        account?</a>
                                    <p className="m-0" style={{color: "#393f81"}}>
                                        <a href="/login" style={{color: "#393f81"}} className="">Login here!</a>
                                    </p>
                                </div>

                                <div className="d-flex justify-content-end pt-3">
                                    <button type="submit" className="btn btn-primary btn-lg ms-2">
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}