import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function useEditVideo(){

    const queryClient = useQueryClient()

    return useMutation((body)=>{
            const refresh = queryClient.getQueryData(['refresh'])
            const accessToken = refresh.data.accessToken
            const url = "http://localhost:3001/edit"
            const config = {
                headers:{
                    "Authorization" : `Bearer ${accessToken}`
                }
            }
            return axios.patch(url,body,config)
        },{
            onSuccess:(data)=>{
                queryClient.invalidateQueries({queryKey: ['video',data.data.id]})
            }
        })
}