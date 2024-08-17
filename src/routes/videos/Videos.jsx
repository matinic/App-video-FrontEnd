import React from 'react'
import { useAllVideos } from '../../hooks/queryHooks.js'
import VideoCard from '../videoCard/VideoCard.jsx'
import style from './Videos.module.css'
import ChannelCard from "../channelCard/channelCard"
export default function Videos() {

const { data, fetchNextPage } = useAllVideos()

return (
    <div className={style.container}>
      <div className={style.allVideos}>
      {
      data?.pages?.map( group =>
          group?.data?.videos.map( vid =>               
            <div key = {vid.id}>
              <VideoCard
                data = { vid }
                navigate
                video
              />
              <ChannelCard
                data = { vid.user }
                title
                image
                navigate
                small
                horizontal
              >
                <VideoCard
                  data = { vid }
                  title
                  navigate  
                />
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
