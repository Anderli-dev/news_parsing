import React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Layout from "./components/Layout";
import {Home} from "./pages/Home";
import {Login} from "./pages/Login";

function App() {
  return (
      <Router>
          <Routes>
              <Route element={ <Layout/> }>
                  <Route path="/" element={<Home/>}/>
              </Route>
              <Route path="/login" element={<Login/>}/>
              {/*<Route path="/register" element={<Register/>}/>*/}
              {/*<Route path="" element={<Logout/>}/>*/}
              {/*<Route path="*" element={<PageNotFound/>}/>*/}
          </Routes>
      </Router>
  );
}

export default App;
