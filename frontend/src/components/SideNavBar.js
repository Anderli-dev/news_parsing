import {Nav} from "react-bootstrap";
import React, {useState} from "react";
import {Motion, spring} from 'react-motion';


export function SideNavBar(props){
    const index = useState(localStorage.getItem('sideTabIndex'))

    const motionStyle =
        props.isOpen?
            {
                x: spring(0),
                opacity: spring(1,  {stiffness: 1000, damping: 25})
            }
        :
            {
                x: spring(-250),
            opacity: spring(0, {stiffness: 700, damping: 27})
            }
    const navLink = {
        width: "250px",
        borderTopLeftRadius: "0px",
        borderBottomLeftRadius: "0px",
        borderTopRightRadius: "25px",
        borderBottomRightRadius: "25px"}

    const onClick = (e) => {
        // TODO if close tab set 0
        localStorage.setItem('sideTabIndex', parseInt(e.target.getAttribute('data-rr-ui-event-key')))
    }

    return(
        <>
            <Motion style={motionStyle}>
                {style => (
                    <Nav
                        style={{
                            transform: `translateX(${style.x}px)`,
                            opacity: style.opacity,
                            backgroundColor: "#202124",
                            marginTop: "59px",
                            zIndex:"999"
                        }}
                        variant="pills"
                        defaultActiveKey={index[0]}
                        onClick={e=>onClick(e)}
                        className="flex-column align-items-start position-fixed vh-100 pt-2">
                        <Nav.Item className="w-100">
                            <Nav.Link href="/" eventKey="0" style={navLink}>News</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="w-100">
                            <Nav.Link href="/add-post" eventKey="1" style={navLink}>Posts</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="w-100">
                            <Nav.Link href="/users" eventKey="2" style={navLink}>Users</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="w-100">
                            <Nav.Link href="/roles" eventKey="3" style={navLink}>Roles</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="w-100">
                            <Nav.Link eventKey="4" style={navLink}>Permissions</Nav.Link>
                        </Nav.Item>
                    </Nav>)}
            </Motion>
        </>
    )
}