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
export const useUpdateResponse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async(payload: {question_id: string, newResponse: string}) => {
            const { data, error } = await supabase.from("questions").update({"response": payload.newResponse}).eq("id", payload.question_id).select("*")
            if(error) throw error.message
            if(data) return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["questions"] });
        },
    })
}
export const deleteQuestion = () =>  {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async(question_id: string) => {
            const { data, error} = await supabase.from("questions").delete().eq("id", question_id)
            if(error) throw error.message
            if(data) return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["questions"] });
        },
    })
}