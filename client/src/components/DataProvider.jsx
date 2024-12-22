import { createContext, useState } from "react"

export const DataContext = createContext();

const  DataProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    return(
        <>
        <DataContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
        {children}
        </DataContext.Provider>
        </>
    )
}
export default DataProvider;