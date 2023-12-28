import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios from  "axios"


const CLOUD_NAME= 'dciywcxvp'
const API_KEY= '566932643731173' 

export default function useUploadImage(){

    const queryClient = useQueryClient()
    
    return useMutation((body)=>{
        const cloud = queryClient.getQueryData(['signature'])
        const config = {
            file: body,
            folder: "user_profile_image"
        }
        const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload?api_key=${API_KEY}&timestamp=${cloud.data.timestamp}&signature=${cloud.data.signature}`
        return axios.post(url,config)
    })
}