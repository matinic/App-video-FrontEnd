import { useQuery } from "@tanstack/react-query";

import axios from 'axios'

export default function useAllVideos (){

    return useQuery({
        queryKey: ['allVideos'],
        queryFn: ()=>{
            const url = "http://localhost:3001/list"
            return axios.get(url)
        },
    })
}