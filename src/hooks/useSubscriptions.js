import {useQuery, useQueryClient} from '@tanstack/react-query'
import axios from 'axios'

export default function useSubscriptions (){
    const queryClient = useQueryClient()
    return useQuery(
        {
            queryKey: ['subscriptions'],
            queryFn: ()=>{
                const {data} = queryClient.getQueryData(['refresh'])
                const url = `http://localhost:3001/subscriptions`
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