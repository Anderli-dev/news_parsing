import {Nav} from "react-bootstrap";
import React from "react";
import {Motion, spring} from 'react-motion';
import {useSelector} from "react-redux";

export function SideNavBar(props){
    const permissions = useSelector((state) => state.permissions.list)
    const currentTabKey = useSelector((state) => state.currentTab.tabKey)
    const tabKey = useSelector((state) => state.tabsKey.tabs)

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


    const CustomNavItem = ({to, children, ...props}) =>{
        return (
            <Nav.Item className="w-100">
                <Nav.Link href={to}
                          className={currentTabKey === props.eventKey ? "bg-primary text-light" : ""}
                          style={navLink}
                          {...props}
                >
                    {children}
                </Nav.Link>
            </Nav.Item>
        )
    }

    const Tabs = (<>
        <CustomNavItem to="/" eventKey={tabKey.home}>News</CustomNavItem>

        {permissions.includes('posts:read') &&
            <CustomNavItem to="/posts" eventKey={tabKey.posts}>Posts</CustomNavItem>
        }
        {permissions.includes('parsing:read') &&
            <CustomNavItem to="/parsing_control" eventKey={tabKey.parsing}>Parsing</CustomNavItem>
        }
        {permissions.includes('users:read') &&
            <CustomNavItem to="/users" eventKey={tabKey.users}>Users</CustomNavItem>
        }
        {permissions.includes('roles:read') &&
            <CustomNavItem to="/roles" eventKey={tabKey.roles}>Roles</CustomNavItem>
        }
    </>)

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
                        className="flex-column align-items-start position-fixed vh-100 pt-2">

                        {Tabs}

                    </Nav>)}
            </Motion>
        </>
    )
}