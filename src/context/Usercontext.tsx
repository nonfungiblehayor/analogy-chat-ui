import { supabase } from "@/hooks/supabase";
import { userType } from "@/types";
import { User } from "@supabase/supabase-js";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const UserContext = createContext<userType>(null)
export const useUser = () => useContext(UserContext)
const UserContextProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState<User>(null)
    const signout = async() => {
        await supabase.auth.signOut().then(() => {
            setUser(null)
        })
    }
    
    useEffect(() => {
        const initAuth = async() => {
            await supabase.auth.getUser().then((response) => {
                if(response.data) {
                   setUser(response.data.user)
                }
                if(response.error) {
                    setUser(null)
                }
            })
          }
          initAuth()
    }, [])
    const values = {
        appUser: user,
        setAppUser: setUser,
        signout: signout
    }
    return (
     <UserContext.Provider value={values}>
        {children}
     </UserContext.Provider>
    )
}
export default UserContextProvider