import { supabase } from ".";
import { questionType } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const addQuestion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async(details: questionType) => {
            const { data, error } = await supabase.from("questions").insert({conversation_id: details.conversation_id, question: details.question,
                response: details.response
            }).select("*").single()
            if(data) return data
            if (error) return error.message
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["questions"] });
        },
    })
}
export const getQuestions = (conversation_id: string) => 
    useQuery({
        queryKey: ["questions", conversation_id],
        queryFn: async() => {
            if(!conversation_id) return null
            const { data, error } = await supabase.from("questions").select("*").eq("conversation_id", conversation_id)
            if(error) throw  error.message
            return data
        }
    })