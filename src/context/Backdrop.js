import { createContext, useContext, useState} from "react";

const BackdropContext = createContext();

export const useBackdrop = () => useContext(BackdropContext)

export const BackdropContextProvider = ({children}) => {
    const [open, setOpen] = useState(false);

    return(
        <BackdropContext.Provider value={{open, setOpen}}>
            {children}
        </BackdropContext.Provider>
    )
}
