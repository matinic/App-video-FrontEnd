import { useQuery } from "@tanstack/react-query";
import axios from 'axios'
import useRefresh from "../hooks/useRefresh"

export default function useUser(){
    
    const {data} = useRefresh()
   
    return useQuery({
        enabled: !!data?.data?.accessToken,
        queryKey: ['user'],
        queryFn: ()=>{
                return axios.get('http://localhost:3001/profile',{
                    headers:{
                        "Authorization": `Bearer ${data.data.accessToken}`
                    }
                })
            },
        })
    }
      
    