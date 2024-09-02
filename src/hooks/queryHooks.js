import { useInfiniteQuery, useQuery} from "@tanstack/react-query";

import  { myApi } from '../axios/myApi'

const useAllVideos = pathname => useInfiniteQuery({
    queryKey: ['allVideos'],
    queryFn: ({pageParam = 0, limit = 12}) => myApi(`/list?limit=${limit}&page=${pageParam}`),
    getNextPageParam: (lastPage) => lastPage.data.nextCursor,
    onError: error => console.log(error),
    enabled: pathname === "/",
})

const useChannel = (channel) => useQuery({
    queryKey: ['channel',channel],
    queryFn: () => myApi(`/channel?username=${channel}`),
    onError: error => console.log(error),
})

const useFollowers = (username) => useQuery({
    queryKey: ['followers',username],
    queryFn: () => myApi(`/followers?username=${username}`),
    onError: error => console.log(error),
})

const useLikedVideos = () => useQuery({
    queryKey: ['likedVideos'],
    queryFn: () => myApi('/likedVideos'),
    onError: error => console.log(error),
    enabled: !!localStorage.getItem('accessToken')
})

const useSubscriptions = () => useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => myApi('/subscriptions'),
    onError: error => console.log(error),
    enabled: !!localStorage.getItem('accessToken')
})

const useUser = () => useQuery({
    queryKey: ['user'],
    queryFn: () => myApi('/profile'),
    onError: error => console.log(error),
    enabled: !!localStorage.getItem('accessToken')
})

const useVideo = (id) => useQuery({
    queryKey: ['video',id],
    queryFn: () => myApi(`/detail?id=${id}`)
})

const useGetNotifications = () =>  useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: ({pageParam = 0, limit = 4}) => myApi(`/notification?limit=${limit}&page=${pageParam}`),
    getNextPageParam: (firstPage,actualPage,lastPage) =>{
        return firstPage.data.nextCursor
    } ,
    onError: error => console.log(error),
    enabled: !!localStorage.getItem('accessToken')
})

const useNotificationsCounter = () => useQuery({
    queryKey: ['notificationsCounter'],
    queryFn: () => myApi('/notification/count'),
    enabled: !!localStorage.getItem('accessToken')
})

const useSearchVideos = query => useInfiniteQuery({
    queryKey: ['searchVideos'],
    queryFn:({pageParam = 0, limit = 12}) => myApi(`/search?q=${query}&limit=${limit}&page=${pageParam}`),
    getNextPageParam: lastPage =>{
        return lastPage.data.nextCursor
    },
    enabled: !!query,
    onError: error => console.log(error),
})

export {
    useAllVideos,
    useChannel,
    useFollowers,
    useLikedVideos,
    useSubscriptions,
    useUser,
    useVideo,
    useGetNotifications,
    useNotificationsCounter,
    useSearchVideos
}