import {useQuery, useQueryClient} from '@tanstack/react-query'
import axios from 'axios'

export default function useSubscriptions (users){
    const queryClient = useQueryClient()
    return useQuery(
        {
            queryKey: [users],
            queryFn: ()=>{
                const {data} = queryClient.getQueryData(['refresh'])
                const url = `http://localhost:3001/subscriptions?users=${users}`
                const config = {
                    headers:{
                        Authorization: `Bearer ${data.accessToken}`
                    }
                }
                return axios.get(url,config)
            }
        }
    )
}