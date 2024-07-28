import { useInfiniteQuery, useQuery} from "@tanstack/react-query";

import  { myApi } from '../axios/myApi'

const useAllVideos = () => useInfiniteQuery({
    queryKey: ['allVideos'],
    queryFn: ({pageParam = 0, limit = 12}) => myApi(`/list?limit=${limit}&page=${pageParam}`),
    getNextPageParam: (lastPage) => lastPage.data.nextCursor
})

const useChannel = (channel) => useQuery({
    queryKey: ['channel',channel],
    queryFn: () => myApi(`/channel?username=${channel}`),
})

const useFollowers = (username) => useQuery({
    queryKey: ['followers',username],
    queryFn: () => myApi(`/followers?username=${username}`)
})

const useLikedVideos = () => useQuery({
    queryKey: ['likedVideos'],
    queryFn: () => myApi('/likedVideos'),
    enabled: !!localStorage.getItem('accessToken')
})

const useSubscriptions = () => useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => myApi('/subscriptions'),
    enabled: !!localStorage.getItem('accessToken')
})

const useUser = () => useQuery({
    queryKey: ['user'],
    queryFn: () => myApi('/profile'),
    enabled: !!localStorage.getItem('accessToken')
})

const useVideo = (id) => useQuery({
    queryKey: ['video',id],
    queryFn: () => myApi(`/detail?id=${id}`)
})

export {
    useAllVideos,
    useChannel,
    useFollowers,
    useLikedVideos,
    useSubscriptions,
    useUser,
    useVideo
}