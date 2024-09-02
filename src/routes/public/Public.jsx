import React from 'react'
import { useAllVideos } from '../../hooks/queryHooks.js'
import { useLocation } from 'react-router-dom'
import AllVideos from '../allVideos/AllVideos.jsx'

export default function Home() {

  const location = useLocation()

  const {
    data:videosPublished,
    fetchNextPage:videosPublishedNext,
    isSuccess:isAllSuccess
  } = useAllVideos(location.pathname)



  if(isAllSuccess) return (
    <div style={{paddingTop:"100px"}}>
        <AllVideos toRender={videosPublished} nextPage={videosPublishedNext} />
    </div>
  )
}
