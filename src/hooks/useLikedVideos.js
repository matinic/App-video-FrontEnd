import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function useLikedVideos (){

    const queryClient = useQueryClient()
    
    return useQuery(['likedVideos'],() => {
            const {data} = queryClient.getQueryData(['refresh'])
            const url = `http://localhost:3001/likedvideos`
            const config = {
                headers:{
                    Authorization: `Bearer ${data.accessToken}`
                }
            }
            return axios.get(url,config)
        }
    )
}



       