import { ReactNode } from "react"
import ChatHeader from "./ChatHeader"
import ChatSidebar from "./ChatSidebar"
import { useUser } from "@/context/Usercontext"
import { useNavigate } from "react-router-dom"

const Layout = ({children}: {children: ReactNode}) => {
   const { appUser } = useUser()
   const navigate = useNavigate()
   const startNewChat = () => {
     if(appUser) {
      navigate("/")
     }
   }
    return (
      <div className="flex h-screen flex-col">
        <ChatHeader newChat={startNewChat}/>
       <div className="flex flex-1 overflow-hidden pt-[57px] md:pt-0">
          <div className="hidden w-80 shrink-0 border-r md:block">
            <div className="h-full">
              <ChatSidebar newChat={startNewChat}/>
            </div>
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
              {children}
          </div>
        </div>
      </div>
    )
}
export default Layout