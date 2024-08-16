import React from 'react'
import { useLikeVideo } from '../../hooks/mutationHooks'
import { useUser } from '../../hooks/queryHooks'
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import style from "./LikesBar.module.css"
export default function LikesBar({video}) {

const {data:user} = useUser()

const {mutate:mutateLike} = useLikeVideo(video.id)

const isLiked = user?.data?.likedVideos.includes(video.id)

const isDisliked = user?.data?.dislikedVideos.includes(video.id)

return (
<div className={style.likeDislike}>
    {/*Like button*/}
    <div 
        name="like"
        onClick={()=>mutateLike('like')}
        data-selected={isLiked}
    >
        <ThumbUpAltOutlinedIcon></ThumbUpAltOutlinedIcon>
        {video.likes}
    </div>
    {/*Dislike button*/}
    <div
        name="dislike"
        onClick={()=>mutateLike('dislike')}
        data-selected={isDisliked}
    >
        <ThumbDownOutlinedIcon></ThumbDownOutlinedIcon>
        {video.dislikes}
    </div>
</div>
)
}
