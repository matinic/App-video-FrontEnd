import {useMutation, useQueryClient} from "@tanstack/react-query"
import axios from  "axios"

export default function useLikeVideo (id){

    const queryClient = useQueryClient()

    return useMutation((option)=>{
        const {data} = queryClient.getQueryData(['refresh'])
        const url = `http://localhost:3001/like`
        const config={
            headers:{
                Authorization: `Bearer ${data.accessToken}`
            }
        }
        return axios.put(url,{id,option},config)
    },{
        onSuccess: (data,err,context)=>{
            queryClient.invalidateQueries(['video',id])
            queryClient.invalidateQueries(['user'])
            queryClient.invalidateQueries(['likedVideos'])
        }
    })
}