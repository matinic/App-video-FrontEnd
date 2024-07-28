import { useQuery } from "@tanstack/react-query";
import axios from 'axios'

export default function useFollowers (username){
    return useQuery({
        queryKey: ['followers',username],
        queryFn:()=>{
            const url = `http://localhost:3001/followers?username=${username}`
            return axios.get(url)
        }
    })
}