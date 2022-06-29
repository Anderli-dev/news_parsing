import React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Layout from "./components/Layout";
import {Home} from "./pages/Home";
import {Login} from "./pages/Login";
import {Logout} from "./actions/Logout";
import {Register} from "./pages/Register";
import {AddPost} from "./pages/AddPost";
import {PostDetail} from "./pages/PostDetail";
import {Users} from "./pages/Users";

function App() {
  return (
      <Router>
          <Routes>
              <Route element={ <Layout/> }>
                  <Route path="/" element={<Home/>}/>
                  <Route path="add-post" element={<AddPost/>}/>
                  <Route path="post/:id" element={<PostDetail/>}/>
                  <Route path="/users" element={<Users/>}/>
              </Route>
              <Route path="/login" element={<Login/>}/>
              <Route path="/register" element={<Register/>}/>
              <Route path="" element={<Logout/>}/>
              {/*<Route path="*" element={<PageNotFound/>}/>*/}
          </Routes>
      </Router>
  );
}

export default App;
