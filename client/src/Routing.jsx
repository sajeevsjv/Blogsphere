import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import {ToastContainer } from "react-toastify";
import Home from "./pages/Home";
function Routing(){
    return(
        <>
        <ToastContainer />
        <Router>
            <Routes>
            <Route path={"/"} element={<Home />} />
            <Route path={"/navbar"} element={<Navbar />} />
            </Routes>
        </Router>
        </>
    )
}
export default Routing;