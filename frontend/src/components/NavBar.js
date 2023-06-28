import React, {useState} from "react";
import {Nav, Navbar} from "react-bootstrap";
import Cookies from "js-cookie";
import {Link, useLocation} from "react-router-dom";
import {Logout} from "../actions/Logout";
import {CreateWhiteIco} from "../actions/CreateWhiteIco";
import {MdOutlineLogin, MdOutlineLogout, MdOutlineMenu} from "react-icons/md";
import '../static/css/nav-bar.css'
import {SideNavBar} from "./SideNavBar";
import {useDispatch} from "react-redux";

export function NavBar() {
    const isAuth = Cookies.get("x-access-token")
    const location = useLocation()
    const [username] = useState(localStorage.getItem('user'))
    const [isOpen, setOpen] = useState(false)
    const dispatch = useDispatch()

    return (
        <>
            <Navbar variant="dark"
                    style={{
                        backgroundColor: "#202124",
                        boxShadow: "0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%), 0px 2px 4px -1px rgb(0 0 0 / 20%)"
                    }}
                    className="p-1 fixed-top">
                <div className="ps-3 pe-5 d-flex w-100">
                    <Navbar.Brand className="fs-4 d-flex">
                        <div className="menu-ico " onClick={() => setOpen(!isOpen)}>{<MdOutlineMenu/>}</div>
                    </Navbar.Brand>
                    <Navbar.Brand className="fs-4 d-flex">
                        <a href="/" style={{color: "#fff"}} className="noselect">News parsing</a>
                    </Navbar.Brand>
                    <Navbar.Collapse id="basic-navbar-nav" className="flex-grow-0 d-flex w-100">
                        <Nav className="w-100">
                            {isAuth
                                ?(
                                    <>
                                        <div className={"d-flex ms-auto"}>
                                            <p className="m-0 p-2">Hi,{username}!</p>
                                            <Nav.Link className="d-flex" as={"a"} href="/" onClick={()=>{Logout(dispatch)}}>
                                                Logout
                                                <div className="ms-1" style={{marginTop: "-1px"}}><MdOutlineLogout/></div>
                                            </Nav.Link>
                                        </div>
                                    </>
                                )
                                :(
                                    <>
                                        <div className={" ms-auto d-flex"}>
                                            <Nav.Link className="d-flex" as={Link} to="/login" state={{ prevLocation: location.pathname}}>
                                                Login
                                                <div className="ms-1">{CreateWhiteIco(<MdOutlineLogin/>)}</div>
                                            </Nav.Link>
                                            <p className={"nav-item m-0 p-2"}>or</p>
                                            <Nav.Link as={Link} to="/register" state={{ prevLocation: location.pathname}}>Register</Nav.Link>
                                        </div>
                                    </>
                                )
                            }
                        </Nav>
                    </Navbar.Collapse>
                </div>
            </Navbar>

            <SideNavBar isOpen={isOpen}/>
        </>
    )
}