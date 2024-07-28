import { useMutation, useQueryClient } from "@tanstack/react-query";
import  { myApi } from '../axios/myApi'
import { cloudinaryAxios } from '../axios/cloudinary'

const useSignin = () => useMutation({
    mutationFn: userInfo => myApi.post('/signin',userInfo),
    onSuccess: res => {
        localStorage.setItem('accessToken',res.data.accessToken)
    }
})

const useLogout = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: () => myApi.post('/logout'),
        onSuccess: () => {
            localStorage.removeItem('accessToken')
            [['user'],['likeVideos'],['subscriptions']].forEach(queryId => {
                queryClient.removeQueries(queryId)
            })
        }
    })       
}

const useCreateVideo = () => useMutation({
    mutationFn: videoInfo => myApi.post('/create',videoInfo),
})

const useDeleteVideo = () => useMutation({
    mutationFn: videoId => myApi.delete(`/delete?id=${videoId}`)
})

const useEditVideo = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: videoInfo => myApi.patch(`/edit?id=${videoInfo.id}`,videoInfo),
        onSuccess: (res,videoInfo) => {
            queryClient.invalidateQueries(['video',videoInfo.id])
        }
    })
}

const useLikeVideo = videoId => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: option => myApi.put(`/like?id=${videoId}&option=${option}`),
        onSuccess: () => {
           [['video',videoId],['user'],['likedVideos']].forEach(queryId => {
            queryClient.invalidateQueries(queryId)
           })
        }
    })
}

const usePublish = videoId => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: option => myApi.put(`/publish?id=${videoId}&published=${option}`),
        onSettled: res => {
            queryClient.invalidateQueries(['video',res.data.id])
        }
    })
} 

const useSignup = () => useMutation({
    mutationFn: newUserData => myApi.post('/signup',newUserData)
})

const useSubscribe = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: userId => myApi.post(`/subscribe?id=${userId}`),
        onSettled: () => {
            [['user'],['channel'],['video'],['subscriptions'],['followers']].forEach( queryId => {
                queryClient.invalidateQueries(queryId)
            })
        }
    })
}

const useUpdateUserData = () => {
    const queryClient = useQueryClient()
    useMutation({
        mutationFn: args => myApi.put('update_profile',args.data),
        onMutate: async args => {
            //Cancelamos las queries en curso
            await queryClient.cancelQueries(['user'])
            await queryClient.cancelQueries(['channel',args.username])
            //capturamos el estado actual y lo guardamos para uso en caso de error poder volver luego a donde estaba
            const prev1 = queryClient.getQueryData(['user'])
            const prev2 = queryClient.getQueryData(['channel',args.username])
            //Se setea el estado en el canche con la informacion nueva antes de que esta se envie al servidor
            queryClient.setQueryData(['user'],(oldData)=>{
                return{
                    ...oldData,
                    data: {...oldData.data,...args.data}
                }
            })
            queryClient.setQueryData(['channel',args.username],(oldData)=>{
                return{
                    ...oldData,
                    data: {...oldData.data,...args.data}
                }
            })
            //Retornamos los estados pasados para su uso en caso de que sea necesario
            return { prev1, prev2, args }
        },
        onError:(err, args, context)=>{
            //En caso de error se hace un rollback al estado anterior
            queryClient.setQueryData(['user'],context.prev1)
            queryClient.setQueryData(['channel',username],context.prev2)
        },
        onSettled: (data, err, args, context) =>{
            //Se actualizan las queries correspondientes en caso de si sale bien o no
            queryClient.invalidateQueries(['user'])
            queryClient.invalidateQueries(['channel',context.args.username])
        },
    })
}

const useUploadImage = () => useMutation({ 
    mutatationFn: image => cloudinaryAxios.post(`/image`,{
        file: image.url,
        ...image.params
    })
})

const useUploadVideo = () => useMutation({
    mutationFn: video => cloudinaryAxios.post(`/video`,{
        file: video
    })
})

const useCloudinarySignature = () => useMutation({
    mutatationFn: params => myApi.post('/signature',params)
})


export {
    useSignin,
    useCreateVideo,
    useDeleteVideo,
    useEditVideo,
    useLikeVideo,
    useLogout,
    usePublish,
    useSignup,
    useSubscribe,
    useUpdateUserData,
    useUploadImage,
    useUploadVideo
}