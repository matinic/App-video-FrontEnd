import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from 'axios';


const CLOUD_NAME= 'dciywcxvp'
const API_KEY= '566932643731173' 
// const API_SECRET= 'Rs_5LDGnochzqTdyXAC7serdGF8'

export default function useUploadVideo (){

    const queryClient = useQueryClient()
    
    return useMutation((video)=>{
      const cloud = queryClient.getQueryData(['signature'])
      const body ={file: `${video}`}
      const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload?api_key=${API_KEY}&timestamp=${cloud.data.timestamp}&signature=${cloud.data.signature}`
      return axios.post(url, body)
    })
}