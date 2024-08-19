import React from 'react'
import style from "./VideoCard.module.css"
import { useNavigate } from 'react-router-dom'

export default function VideoCard({data,children,...show}) {

const navigate = useNavigate()

const goToChannel = () => {
  if( show.navigate ) navigate(`/detail/${data.id}`) 
  return
}

return (
  <div
    data-navigate = { show.navigate }
  >
    {
    show.screen && 
      <video
        src = { data.url }
        className = { style.thumbnail }
        onClick = { goToChannel }
      />
    }
    {
    show.title &&
      <span className={style.titleContainer}>
        <h4
          className ={ style.videoTitle }
          onClick = { goToChannel }
        >
            { data.title }
        </h4>
        { children } 
      </span>
    }
  </div>
)
}
