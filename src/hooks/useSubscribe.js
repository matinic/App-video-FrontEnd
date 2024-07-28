import {useMutation, useQueryClient} from "@tanstack/react-query"
import axios from "axios"

export default function useSubscribe (){
    const queryClient = useQueryClient()
    return useMutation((id)=>{
        const {data} = queryClient.getQueryData(['refresh'])
        const url = "http://localhost:3001/subscribe"
        const config = {
            headers :{
                Authorization: `Bearer ${data.accessToken}`
            }
        }
        return axios.post(url,{id},config)
    },{
        onSettled:()=>{
            queryClient.invalidateQueries(['user'])
            queryClient.invalidateQueries(['channel'])
            queryClient.invalidateQueries(['video'])
            queryClient.invalidateQueries(['subscriptions'])
            queryClient.invalidateQueries(['followers'])
        }
    })
}