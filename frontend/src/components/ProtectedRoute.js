import React, {useEffect, useState} from 'react';
import {Outlet} from 'react-router-dom';
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import {MDBBtn} from "mdb-react-ui-kit";
import {Page404} from "../pages/404";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

export default () => {
    const [isTokenValid, setIsTokenValid] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const token = Cookies.get('x-access-token')

    const isSameOrAfter = require('dayjs/plugin/isSameOrAfter')
    dayjs.extend(isSameOrAfter)

    const CheckAuthSatus = () => {
        if(token){
            if (Cookies.get('session') === '1'){
                const decoded = jwt_decode(token);
                const now = dayjs()

                if (dayjs(dayjs.unix(decoded.exp)).isSameOrAfter(now)) {
                    //    show content
                    setIsTokenValid(true)
                } else {
                    //    show modal
                    setIsTokenValid(false)
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
        CheckAuthSatus()
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