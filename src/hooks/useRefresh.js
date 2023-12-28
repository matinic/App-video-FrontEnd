import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export default function useRefresh(){
    
    return useQuery({
        queryKey:['refresh'],
        queryFn: ()=>{
                return axios('http://localhost:3001/refresh',{
                    withCredentials: true,
                    credentials: 'include',
                })
        },
        refetchInterval: 1000 * 60 * 10
    })
}