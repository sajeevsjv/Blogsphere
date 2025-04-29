import { createContext, useState } from "react"
export const DataContext = createContext();

const  DataProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [blogId, setBlogId] = useState(null);

  
    return(
        <>
        <DataContext.Provider value={{isLoggedIn, setIsLoggedIn, blogId, setBlogId}}>
        {children}
        </DataContext.Provider>
        </>
    )
}
export default DataProvider;