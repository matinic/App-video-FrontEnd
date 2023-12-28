import React from 'react'
import useAllVideos from '../../hooks/useAllVideos.js'
import VideoCard from '../videoCard/VideoCard.jsx'
import style from './Videos.module.css'

export default function Videos() {

const {data} = useAllVideos()
const allVideos = data?.data?.videos

  return (
    <div className={style.videosContainer}>
        {
            allVideos?.map((video, i) => {
                return (   
                      <VideoCard video = {video} key={i} showData={true} />
                  )
            }).reverse()
        }
    </div>

  
  )
}
