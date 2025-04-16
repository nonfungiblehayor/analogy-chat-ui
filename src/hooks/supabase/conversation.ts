import { conversationType } from "@/types";
import { supabase } from ".";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
}

export const useGetHistory = (user_id: string) => 
    useQuery({
        queryKey: ["conversations", user_id],
        queryFn: async() => {
            if(!user_id) return null
            const { data, error } = await supabase.from("conversations").select("*").eq("user_id", user_id).order('created_at', { ascending: false })
            if (error) throw new Error(error.message);
            return data;
        } 
})
export const useAddConversation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (conversationDetails: conversationType) => {
            const { data, error } = await supabase.from("conversations").insert([conversationDetails]).select().single()
            if (error) throw new Error (error.message)
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
        },
    })
}
export const useGetConversation = (id: string) => 
    useQuery({
        queryKey: ["conversation", id],
        queryFn: async() => {
            if(!id) return null
            const { data, error } = await supabase.from("conversations").select("*").eq("id", id).single()
            if (error) throw new Error (error.message)
            return data
        }
    })