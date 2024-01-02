import { useMutation } from "@tanstack/react-query";
import axios from 'axios';


export default function useCloudinarySignature(){
    return useMutation((params)=>{
        const url = 'http://localhost:3001/signature'
        return axios.post(url,params)
    })
}