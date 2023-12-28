import { useQuery } from "@tanstack/react-query";
import axios from 'axios'

export default function useChannel (channel){
    return useQuery(['channel',channel],()=>{
        return axios.get(`http://localhost:3001/channel?username=${channel}`)
    })
}