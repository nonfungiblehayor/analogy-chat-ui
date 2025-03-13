import { supabase } from "@/hooks/supabase";
import { userType } from "@/types";
import { createContext, ReactNode, useEffect, useState } from "react";

export const User = createContext<userType>(null)
export const SetUser = createContext<any>(null)

const UserContextProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState<userType>()
    const signout = async() => {
        await supabase.auth.signOut().then(() => {
            setUser(null)
        })
    }
    useEffect(() => {
        const initAuth = async() => {
            await supabase.auth.getSession().then((response) => {
                if(response.data) {
                    setUser(response.data.session)
                }
                if(response.error) {
                    setUser(null)
                }
            })
          }
          initAuth()
    }, [user])
    return (
        <User.Provider value={user}>
            <SetUser.Provider value={signout}>
                {children}
            </SetUser.Provider>
        </User.Provider>
    )
}
export default UserContextProvider