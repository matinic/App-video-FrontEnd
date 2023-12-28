import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useVideo (id){
    return useQuery(['video',id],()=>{ 
        const url = `http://localhost:3001/detail?id=${id}`
        return axios.get(url)
    })

}