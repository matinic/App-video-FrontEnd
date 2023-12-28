import {useMutation, useQueryClient} from "@tanstack/react-query"
import axios from  "axios"

export default function useLikeVideo (){

    const queryClient = useQueryClient()

    return useMutation((id)=>{
        const {data} = queryClient.getQueryData(['refresh'])
        const url = `http://localhost:3001/like`
        const config={
            headers:{
                Authorization: `Bearer ${data.accessToken}`
            }
        }
        return axios.put(url,{id},config)
    },{
        onSettled: (data,err,context)=>{
            queryClient.invalidateQueries(['video',context])
            queryClient.invalidateQueries(['user'])
            queryClient.invalidateQueries(['likedVideos'])
        }
    })
}