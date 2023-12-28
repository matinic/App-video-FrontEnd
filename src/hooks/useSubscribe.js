import {useMutation, useQueryClient} from "@tanstack/react-query"
import axios from "axios"

export default function useSubscribe (){
    const queryClient = useQueryClient()
    return useMutation((id)=>{
        const {data} = queryClient.getQueryData(['refresh'])
        const url = "http://localhost:3001/follow"
        const config = {
            headers :{
                Authorization: `Bearer ${data.accessToken}`
            }
        }
        const body = {id}
        return axios.post(url,body,config)
    },{
        onSettled:()=>{
            queryClient.invalidateQueries(['user'])
            queryClient.invalidateQueries(['channel'])
            queryClient.invalidateQueries(['video'])
            queryClient.invalidateQueries(['subscriptions'])
        }
    })
}