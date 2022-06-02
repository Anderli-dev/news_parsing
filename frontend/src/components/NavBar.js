import React from "react";
import {Nav, Navbar} from "react-bootstrap";

export function NavBar() {
    return (
        <>
            <Navbar variant="dark"
                    style={{
                        backgroundColor: "#202124",
                        boxShadow: "0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%), 0px 2px 4px -1px rgb(0 0 0 / 20%)"
                    }}>
                <Navbar.Brand className="fs-4 d-flex ps-5" href="/">News parsing</Navbar.Brand>
                <Navbar.Collapse id="basic-navbar-nav" className="flex-grow-0 d-flex w-100">
                    <Nav className="w-100">


                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    )
}