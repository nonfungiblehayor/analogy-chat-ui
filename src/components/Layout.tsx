import { ReactNode } from "react"
import ChatHeader from "./ChatHeader"
import ChatSidebar from "./ChatSidebar"
import { useUser } from "@/context/Usercontext"
import { useNavigate } from "react-router-dom"

import GameView from "./GameView"
import GameToggle from "./GameToggle"
import { useGame } from "@/context/GameContext"

const Layout = ({ children }: { children: ReactNode }) => {
  const { appUser } = useUser()
  const navigate = useNavigate()
  const { isGameMode } = useGame()

  const startNewChat = () => {
    if (appUser) {
      navigate("/")
    }
  }

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <GameToggle />
      {/* Game View Overlay */}
      <div
        className={`absolute inset-0 z-50 transition-transform duration-500 ease-in-out ${isGameMode ? 'translate-y-0' : 'translate-y-full'
          }`}
      >
        <GameView />
      </div>

      {/* Main Chat Layout */}
      <div className={`flex h-full flex-col transition-transform duration-500 ${isGameMode ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}>
        <ChatHeader newChat={startNewChat} />
        <div className="flex flex-1 overflow-hidden pt-[57px] md:pt-0">
          <div className="hidden w-80 shrink-0 border-r md:block">
            <div className="h-full">
              <ChatSidebar newChat={startNewChat} />
            </div>
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Layout