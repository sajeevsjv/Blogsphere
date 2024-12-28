import React from "react";
import { useNavigate } from "react-router-dom";

const AdminNavbar = ()=>{

    const navigate = useNavigate();
      const handlelogout = () => {
        const clearLocalStorage =  localStorage.clear();
        if (clearLocalStorage){
          navigate("/login");
        }
      }

    return(
       <>
       <nav className="flex fixed w-full justify-between px-8 items-center p-6 bg-blue-500">
        <h2 className="text-white text-2xl font-bold">Admin Dashboard</h2>
        <button onClick={handlelogout} className="flex gap-2 items-center text-white"><img width="28" height="28"  src="./images/icons8-logout-48.png" alt="exit"/> Logout</button>
       </nav>
       </>
    )
    
}
export default AdminNavbar;