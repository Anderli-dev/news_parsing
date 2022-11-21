import React, {useEffect, useState} from 'react';
import {Outlet} from 'react-router-dom';
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import moment from "moment";
import {Logout} from "../actions/Logout";
import {MDBBtn} from "mdb-react-ui-kit";
import {Page404} from "../pages/404";

export default () => {
    const [isTokenValid, setIsTokenValid] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const token = Cookies.get('x-access-token')

    const Check_auth_satus = () => {
        if(token){
            if (Cookies.get('session') === '1'){
                const decoded = jwt_decode(token);
                const now = moment({})

                if (moment(moment.unix(decoded.exp)).isSameOrAfter(now)) {
                    //    show content
                    setIsTokenValid(true)
                } else {
                    //    show modal
                    Cookies.set("session", 0)
                    setIsTokenValid(false)
                    Logout()
                }
            }
            else {
                setIsTokenValid(false)
            }
        }
        else {
            setIsLoggedIn(false)
        }

    }

    useEffect(() => {
        Check_auth_satus()
    }, []);

    return (
        <>

            {isLoggedIn ?
                <>
                    {
                        isTokenValid ?
                            <>
                                <Outlet/>
                            </>
                            :
                            <>
                                <div className='d-flex justify-content-center vh-100 align-items-center'>
                                    <div className='d-flex flex-column align-items-center'>
                                        <p className='fs-1'>Session has expired</p>
                                        <p className='fs-3'>Your session has expired! Pleas login again</p>
                                        <MDBBtn href={'/login'}>Login</MDBBtn>
                                    </div>
                                </div>
                            </>
                    }
                </>
                :
                <>
                    {<Page404/>}
                </>
            }

        </>
    );
};