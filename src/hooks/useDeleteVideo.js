import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function useDeleteVideo(){

    const queryClient = useQueryClient()

    return useMutation((id)=>{
        const {data} = queryClient.getQueryData(["refresh"])

        const url = `http://localhost:3001/delete?id=${id}`
        const config = {
            headers:{
                withCredentials: true,
                "Authorization" : `Bearer ${data.accessToken}`
            }
        }
        return axios.delete(url,config)
    })
}