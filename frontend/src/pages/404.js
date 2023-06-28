import React from "react";

export function Page404() {
    return (
        <div className="d-flex justify-content-center vh-100 align-items-center">
            <div className="d-flex flex-column">
            <div>
                <h1>Ooops.....</h1>
                <h2>This page not exit</h2>
                <p>Look at this duck instead</p>
                <div>
                    <div className="ms-5">
                        <p className="mb-0 lh-1">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_</p>
                        <p className="mb-0 lh-1">.&nbsp;__(.)&#60;(MEOW)</p>
                        <p className="mb-0 lh-1">&nbsp;\___)</p>
                    </div>
                    <p className="mb-0 lh-1">~~~~~~~~~~~~~~~~~~</p>
                </div>
            </div>
            <a className="text-center" style={{marginLeft: "-50px"}} href="/">HOME -->></a>
                </div>
        </div>
    );
}