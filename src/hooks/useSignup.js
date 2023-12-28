import {useMutation} from "@tanstack/react-query"
import axios from 'axios'

export default function useSignup (){
    return useMutation((body)=>{
        const url = 'http://localhost:3001/signup';
        const config = {
            withCredentials: true,
            credentials: 'include',   
        }
        return axios.post(url,body,config)
    })
}



