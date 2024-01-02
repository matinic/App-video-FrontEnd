import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from 'axios'

export default function(username){

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (body)=>{
            const data = queryClient.getQueryData(['refresh'])
            const url = 'http://localhost:3001/update_profile'
            const config = {
                headers:{
                    "Authorization" : `Bearer ${data.data.accessToken}`
                }
            }
            return axios.put(url,body,config)
        },
        onMutate: async(body)=>{
            //Cancelamos las queries en curso
            await queryClient.cancelQueries(['user'])
            await queryClient.cancelQueries(['channel',username])
            //capturamos el estado actual y lo guardamos para uso en caso de error poder volver luego a donde estaba
            const prev1 = queryClient.getQueryData(['user'])
            const prev2 = queryClient.getQueryData(['channel',username])
            //Se setea el estado en el canche con la informacion nueva antes de que esta se envie al servidor
            queryClient.setQueryData(['user'],(oldData)=>{
                return{
                    ...oldData,
                    data: {...oldData.data,...body}
                }
            })
            queryClient.setQueryData(['channel',username],(oldData)=>{
                return{
                    ...oldData,
                    data: {...oldData.data,...body}
                }
            })
            //Retornamos los estados pasados para su uso en caso de que sea necesario
            return { prev1, prev2, body }
        },
        onError:(err, newTodo, context)=>{
            //En caso de error se hace un rollback al estado anterior
            queryClient.setQueryData(['user'],context.prev1)
            queryClient.setQueryData(['channel',username],context.prev2)
        },
        onSettled: ()=>{
            //Se actualizan las queries correspondientes en caso de si sale bien o no
            queryClient.invalidateQueries(['user'])
            queryClient.invalidateQueries(['channel',username])
        },

    })
}