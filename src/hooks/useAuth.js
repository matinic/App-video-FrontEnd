import { useQuery, useQueryClient } from '@tanstack/react-query'

export default function useAuth (info){
    const queryClient = useQueryClient()
    const token = queryClient.getQueryData(['refresh'])
    const accessToken = token?.data?.accessToken
  
    return accessToken
}






