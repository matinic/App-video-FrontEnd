import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios"

export default function usePublish (id){

    const queryClient = useQueryClient()

    return useMutation((published)=>{
        const {data} = queryClient.getQueryData(['refresh'])
        const url = "http://localhost:3001/publish"
        const config = {
            headers:{
                "Authorization" : `Bearer ${data.accessToken}`
            }
        }
        return axios.put(url,{published,id},config)
    },{
        onSettled: ()=>{
            queryClient.invalidateQueries(['video',id])
        }
    })
}