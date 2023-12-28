import { useQuery } from "@tanstack/react-query";
import axios from "axios"

export default function useCloudinarySignature(){
    return useQuery(
        ['signature'],
        ()=>{
           return axios.get('http://localhost:3001/signature')
        },
    )
}