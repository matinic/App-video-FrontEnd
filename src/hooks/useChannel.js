import { useQuery } from "@tanstack/react-query";
import axios from 'axios'

export default function useChannel (channel){
    return useQuery({
        queryKey: ['channel',channel],
        queryFn: ()=> axios.get(`http://localhost:3001/channel?username=${channel}`),
    }
       
        
    )
}