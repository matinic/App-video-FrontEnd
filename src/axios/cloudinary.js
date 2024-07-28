import axios from 'axios'
import { myApi } from './myApi'

const CLOUD_NAME= 'dciywcxvp' 
const API_KEY= '566932643731173' 

const cloudinaryAxios = axios.create({
    baseURL:  `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/`
})

cloudinaryAxios.interceptors.request.use( async config => {
    try {
        const {file, ...paramsToSign} = config.data
        const cloud = await myApi.post('/signature',paramsToSign)
        config.url = `${config.url}/upload?api_key=${API_KEY}&timestamp=${cloud.data.timestamp}&signature=${cloud.data.signature}`
        return config
    } catch (error) {
        alert(error.message)
    }
})

export {
    cloudinaryAxios,
}