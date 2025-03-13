import { supabase } from ".";
import { useQuery } from "@tanstack/react-query";

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
}

export const useGetHistory = (user_id: string) => 
    useQuery({
        queryKey: ["conversations", user_id],
        queryFn: async() => {
            const { data, error } = await supabase.from("conversations").select("*").eq("user_id", user_id)
            if (error) throw new Error(error.message);
            return data;
        } 
})