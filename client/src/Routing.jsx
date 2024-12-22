import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import {ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import AddBlog from "./pages/AddBlog";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

function Routing(){
    return(
        <>
        <ToastContainer />
        <Router>
            <Routes>
            <Route path={"/"} element={<Home />} />
            <Route path={"/navbar"} element={<Navbar />} />
            <Route path={"/addblog"} element={<AddBlog />} />
            <Route path={"/signup"} element={<Signup />} />
            <Route path={"/login"} element={<Login />} />
            </Routes>
        </Router>
        </>
    )
}
export default Routing;