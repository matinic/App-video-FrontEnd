import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from 'axios'

const login = (form)=>{
    return axios.post('http://localhost:3001/signin',form,{
        withCredentials: true,
        credentials: 'include'
    })
}
const useLogin = ()=>{
    const queryClient = useQueryClient()
    return useMutation(login,
        {
            onSuccess: async() =>{
                await queryClient.prefetchQuery(
                    ['refresh'],
                    ()=> axios('http://localhost:3001/refresh',{
                            withCredentials: true,
                            credentials: 'include',
                        }),
                )}
        }
    )
}
export default useLogin