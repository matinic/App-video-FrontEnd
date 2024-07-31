import axios from 'axios'
import chalk from 'chalk';

const requireAuthRoutes = ['/profile','/create','/delete','/edit','/likedVideos','/publish','/subscribe','/user_profile','/user','/like','/signature','/update_profile']

const myApi = axios.create({
    baseURL: 'http://localhost:3001/',
})

myApi.interceptors.request.use(config => {
    console.log(chalk.bgBlue(config.url))
    const relativeRoute = config.url.split('?')
    const isRequiredAuthRoute = requireAuthRoutes.includes(relativeRoute[0])
    if(isRequiredAuthRoute){
        const accessToken = localStorage.getItem('accessToken')
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
    }
    if(['/signin','/logout','/refresh'].includes(config.url)) config.withCredentials = true
    return config
})

myApi.interceptors.response.use(    
    response => {
        console.log(chalk.bgGreen.black(response.config.url))
        return response
    }, 
    async error => {
        const originalRequest = error.config

        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                console.log(chalk.bgYellow.black('retrying'))
                const response = await myApi('/refresh')
                const accessToken = response?.data?.accessToken
                localStorage.setItem('accessToken', accessToken)
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
                return myApi(originalRequest)
            } catch (error) {
                alert('Session Expired, Login again')
                localStorage.removeItem('accessToken')
                window.location.href = "/signin"
            }
        }
        return Promise.reject()
    }
)

export {
    myApi,
}