import React from 'react';
import {NavBar} from './NavBar';
import {Outlet} from 'react-router-dom';
import {useEffect} from "react";
import Cookies from "js-cookie";
import {useDispatch} from "react-redux";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import {Logout} from "../actions/Logout";
import {clearPermissions} from "../store/userPermisions";

export default () => {
    const token = Cookies.get('x-access-token')
    const dispatch = useDispatch()

    const isSameOrAfter = require('dayjs/plugin/isSameOrAfter')
    dayjs.extend(isSameOrAfter)

    const CheckSession = () => {
            if(token) {
                const decoded = jwt_decode(token);
                const now = dayjs()

                if (!dayjs(dayjs.unix(decoded.exp)).isSameOrAfter(now)) {
                    Logout(dispatch)
                }
            }
            if(Cookies.get('session') === '0' || !Cookies.get('session')){
                dispatch(clearPermissions());
            }
    }

    useEffect(() => {
        CheckSession()
    }, []);

    return (
        <>
            <NavBar/>
            <div className="container vh-100" style={{ paddingTop: "59px"}}>
                <Outlet/>
            </div>
        </>
    );
};