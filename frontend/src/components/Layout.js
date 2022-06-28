import React from 'react';
import {NavBar} from './NavBar';
import { Outlet } from 'react-router-dom';

export default () => {
    return (
        <React.Fragment>
            <NavBar />
            <div className="container" style={{ paddingTop: "59px"}}>
                <Outlet />
            </div>
        </React.Fragment>
    );
};