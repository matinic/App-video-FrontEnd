import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from 'axios'

const logout = ()=>{
    return axios.get('http://localhost:3001/logout',{
        credentials: 'include',
        withCredentials: true
    })
}
const useLogout = ()=>{
    const queryClient = useQueryClient()
    return useMutation(logout,{
        onSuccess: ()=>{
            queryClient.removeQueries(['refresh'])
            queryClient.removeQueries(['user'])
            queryClient.removeQueries(['likedVideos'])
            queryClient.removeQueries(['subscriptions'])
        }
    })
}
export default useLogout