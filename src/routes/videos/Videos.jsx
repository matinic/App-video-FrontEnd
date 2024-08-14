import React from 'react'
import { useAllVideos } from '../../hooks/queryHooks.js'
import VideoCard from '../videoCard/VideoCard.jsx'
import style from './Videos.module.css'
import ChannelCard from "../channelCard/channelCard"
export default function Videos() {

const { data, fetchNextPage } = useAllVideos()
const allVideos = data?.pages

return (
    <div className={style.container}>
      <div className={style.allVideos}>
      {
      allVideos?.map( group =>
          group?.data?.videos.map( vid =>               
            <div key = {vid.id}>
              <VideoCard video = {vid} title videoTitle/>
              <ChannelCard
                  data = {vid.user}
                  title
                  image
                  navigate
                  small
              >
               {vid.title}
              </ChannelCard>
            </div>
        ))
      }
      </div>
      <button
        className={style.mostrarMas}
        onClick={()=>fetchNextPage()}
      >
        Load More
      </button>
    </div>
  )
}
