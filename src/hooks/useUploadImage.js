import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios from  "axios"


const CLOUD_NAME= 'dciywcxvp'
const API_KEY= '566932643731173' 

export default function useUploadImage(){

    return useMutation(({body,data,params})=>{
 
        const config = {
            file: body,
            ...params
        }
        const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload?api_key=${API_KEY}&timestamp=${data.data.timestamp}&signature=${data.data.signature}`
        return axios.post(url,config)
    })
}

 