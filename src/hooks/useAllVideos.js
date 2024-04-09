import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import axios from 'axios'

export default function useAllVideos (){

    return useInfiniteQuery({
        queryKey: ['allVideos'],
        queryFn: ({pageParam = 0})=>{
            console.log(pageParam)
            const url = `http://localhost:3001/list?limit=${8}&page=${pageParam}`
            return axios.get(url)
        },
       getNextPageParam: (lastPage, page) => lastPage.data.nextCursor
    
    })
}