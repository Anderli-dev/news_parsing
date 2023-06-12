import React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import {Home} from "./pages/Home";
import {Login} from "./pages/Login";
import {Register} from "./pages/Register";
import {AddPost} from "./pages/AddPost";
import {PostDetail} from "./pages/PostDetail";
import {Users} from "./pages/Users";
import {User} from "./pages/User";
import {Roles} from "./pages/Roles";
import {RoleCreate} from "./pages/RoleCreate";
import {Role} from "./pages/Role";
import {Page404} from "./pages/404";
import {useSelector} from "react-redux";

function App() {
    const permissions = useSelector((state) => state.permissions.list)
    return (
        <Router>
            <Routes>
                <Route element={<ProtectedRoute/>}>
                    <Route element={ <Layout/> }>
                        {permissions.includes('post:update')&&<Route path="/post" element={<AddPost/>}/>}
                        {permissions.includes('users:read')&&<Route path="/users" element={<Users/>}/>}
                        {permissions.includes('user:read')&&<Route path="/user/:id" element={<User/>}/>}
                        {permissions.includes('roles:read')&&<Route path="/roles" element={<Roles/>}/>}
                        {permissions.includes('role:read')&&<Route path="/role/:id" element={<Role/>}/>}
                        {permissions.includes('role:create')&&<Route path="/role-create" element={<RoleCreate/>}/>}
                    </Route>
                </Route>

                <Route element={ <Layout/> }>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/post/:id" element={<PostDetail/>}/>
                </Route>

                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="*" element={<Page404/>}/>
            </Routes>
        </Router>
    );
}

export default App;
