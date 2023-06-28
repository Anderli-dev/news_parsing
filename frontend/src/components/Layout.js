import React from 'react';
import {NavBar} from './NavBar';
import {Outlet} from 'react-router-dom';
import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {useDispatch} from "react-redux";
import jwt_decode from "jwt-decode";
import moment from "moment";
import {Logout} from "../actions/Logout";
import {clearPermissions} from "../store/userPermisions";

export default () => {
    const token = Cookies.get('x-access-token')
    const dispatch = useDispatch()

    const CheckSession = () => {
            if(token) {
                const decoded = jwt_decode(token);
                const now = moment({})

                if (!moment(moment.unix(decoded.exp)).isSameOrAfter(now)) {
                    Logout(dispatch)
                }
            }
            if(Cookies.get('session') === '0'){
                dispatch(clearPermissions());
            }
    }

    useEffect(() => {
        CheckSession()
    }, []);

    return (
        <>
            <NavBar/>
            <div className="container" style={{ paddingTop: "59px"}}>
                <Outlet/>
            </div>
        </>
    );
};