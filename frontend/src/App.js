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
import {Role} from "./pages/Role";
import {Page404} from "./pages/404";

function App() {
    return (
        <Router>
            <Routes>
                <Route element={<ProtectedRoute/>}>
                    <Route element={ <Layout/> }>
                        <Route path="/post" element={<AddPost permission={'post:update'}/>}/>
                        <Route path="/users" element={<Users permission={'users:read'}/>}/>
                        <Route path="/user/:id" element={<User permission={'user:read'}/>}/>
                        <Route path="/roles" element={<Roles permission={'roles:read'}/>}/>
                        <Route path="/role/:id" element={<Role permission={'role:read'}/>}/>
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
