import { Session, User } from "@supabase/supabase-js"
import { Dispatch, SetStateAction } from "react"
export type userType = {
   appUser: User,
   setAppUser: Dispatch<SetStateAction<User>>,
   signout: () => void
}
export type conversationType = {
    user_id: string,
    title: string,
    initial_message: string,
    id?: string
}
export type questionType = {
    id?: string,
    conversation_id: string,
    question: string,
    response: string
}