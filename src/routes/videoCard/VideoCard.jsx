import React from 'react'
import style from "./VideoCard.module.css"
import { useNavigate } from 'react-router-dom'

export default function VideoCard({data,...show}) {
  const navigate = useNavigate()
  return (
    <div 
      onClick={ () => show.navigate && navigate(`/detail/${data.id}`) }
      data-navigate = { show.navigate }
    >
      {
      show.video && 
        <video
          src = {data.url}
          className={style.thumbnail}
        />
      }
      {
      show.title &&
        <h4
            className={style.videoTitle}
        >
            {data.title}
        </h4>
      }
    </div>
  )
}
