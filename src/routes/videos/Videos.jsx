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
                  screen
              />
              <ChannelCard
                  data = { vid.user }
                  name
                  image
                  navigate
                  size="small"
                  horizontal
              >
                <VideoCard
                    data = { vid }
                    title
                    navigate
                    small
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
