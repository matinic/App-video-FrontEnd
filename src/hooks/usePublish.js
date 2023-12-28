import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios"

export default function usePublish (){

    const queryClient = useQueryClient()

    return useMutation((body)=>{
        const {data} = queryClient.getQueryData(['refresh'])
        const url = "http://localhost:3001/publish"
        const config = {
            headers:{
                "Authorization" : `Bearer ${data.accessToken}`
            }
        }
        return axios.put(url,body,config)
    },{
        onSettled: (data,_b,context)=>{
            queryClient.invalidateQueries(['video',context.id])
        }
    })
}