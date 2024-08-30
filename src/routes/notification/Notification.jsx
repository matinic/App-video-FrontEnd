import React from 'react'
import ChannelCard from '../channelCard/channelCard'
import { useNavigate } from 'react-router-dom'
function Notification({data}) {

const navigate = useNavigate()

return (
    <li
        style={{display:"flex", justifyContent: "space-between"}}
        onClick={()=>{data.videoId && navigate(`/detail/${data.videoId}`)}}
    >
    <ChannelCard data={data?.video?.user} size="small" image>
      <h5 style={{margin:"0px", fontStyle:"italic"}}>{data?.message}</h5>
      <h4>{data?.video?.title}</h4>
    </ChannelCard>
    <img src={data?.video?.poster} style={{width:"60px", objectFit: "contain"}}></img>
  </li>
  )
}

export default Notification