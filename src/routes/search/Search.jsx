import { useEffect } from 'react'
import { useSearchVideos } from '../../hooks/queryHooks.js'
import AllVideos from '../allVideos/AllVideos.jsx'
import { useParams } from 'react-router-dom'
export default function Search() {

const params = useParams()

const  {
    data:search,
    fetchNextPage:searchNext,
    isSuccess:isSearchSuccess,
    refetch
} = useSearchVideos(params.query)

useEffect(()=>{
    refetch()
},[params.query])
 
if(isSearchSuccess) return (
    <div style={{paddingTop:"100px"}}>
        {
        search.pages[0].data.videos.length
            ? <h4 style={{textAlign:"center"}}>Results for: "{params.query}"</h4>  
            : <h4 style={{textAlign:"center"}}>No results found</h4>  
        }

        <AllVideos toRender={search} nextPage={searchNext} />
    </div>
    )

}