import React from 'react'
import useAllVideos from '../../hooks/useAllVideos.js'
import VideoCard from '../videoCard/VideoCard.jsx'
import style from './Videos.module.css'

export default function Videos() {

const {
  data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
} = useAllVideos()
const allVideos = data?.pages

  return (
      <div className={style.container}>
      <div className={style.allVideos}>
        {
          allVideos?.map((group, i) =>
          group?.data?.videos.map(
              (video,i)=>
                <VideoCard
                  video = {video}
                  key={i}
                  showData={true}/>
            )
          )
        }
      </div>
      <button className={style.mostrarMas} onClick={()=>{
          fetchNextPage()
        }}>
        Load More
      </button>
    </div>
  )
}
