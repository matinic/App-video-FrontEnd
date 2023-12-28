import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function useEditVideo(){

    const queryClient = useQueryClient()

    return useMutation(({body})=>{
            const data = queryClient.getQueryData(['refresh'])
            const accessToken = data.data.accessToken
            const url = "http://localhost:3001/edit"
            const config = {
                headers:{
                    "Authorization" : `Bearer ${accessToken}`
                }
            }
            return axios.patch(url,body,config)
        },{
            onMutate: async ({body,name})=>{
                await queryClient.cancelQueries(['video',body.id])
                const prev = queryClient.getQueryData(['video',body.id])
                queryClient.setQueryData(['video',body.id],(oldData)=>{
                    return{
                        ...oldData,
                        [name]: body[name]
                    }
                })
                return { prev, body }
            },
            onError:(err, newTodo, context)=>{
                queryClient.setQueryData(
                    ['todo',context.body.id],
                    context.prev
                )
            },
            onSettled:({data})=>{
                queryClient.invalidateQueries({queryKey: ['video',data.id]})
            }
        })
}