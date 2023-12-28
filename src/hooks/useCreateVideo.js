import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from 'axios';

export default function useCreateVideo (){
    
    const queryClient = useQueryClient()

    return useMutation((form)=>{
        const data = queryClient.getQueryData(['refresh'])
        const accessToken = data.data.accessToken
        const url = `http://localhost:3001/create`
        const config = {
            withCredentials: true,
            headers:{
                "Authorization" : `Bearer ${accessToken}`
            }
        }
        return axios.post(url,form,config)
    })
}
