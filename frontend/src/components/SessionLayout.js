import React, {useState} from 'react';
import {Outlet} from 'react-router-dom';
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import moment from "moment";
import {Logout} from "../actions/Logout";
import {MDBBtn} from "mdb-react-ui-kit";

export default () => {
    const [isTokenValid, setIsTokenValid] = useState(false)
    const token = Cookies.get('x-access-token')

    const Check_auth_satus = () => {
        if(token){
            const decoded = jwt_decode(token);
            const now = moment({})

            if(moment(moment.unix(decoded.exp)).isSameOrAfter(now)){
                //    show content
                setIsTokenValid(true)
            }else {
                //    show modal
                setIsTokenValid(false)
                return(<><Logout/></>)
            }

        }
    }
    return (
        <>
            <Check_auth_satus/>
            {isTokenValid?
                <>
                    <Outlet />
                </>
                :
                <>
                    <p className='fs-1'>Session has expired</p>
                    <p className='fs-3'>Your session has expired! Pleas login again</p>
                    <MDBBtn href={'/login'}>Login</MDBBtn>
                </>
            }
        </>
    );
};