import VideoCard from '../videoCard/VideoCard.jsx'
import style from './AllVideos.module.css'
import ChannelCard from "../channelCard/ChannelCard.jsx"

const AllVideos = ({toRender,nextPage}) => {

return(
        <div className={style.container}>
            <div className={style.allVideos}>
            {
            toRender?.pages?.map( group =>
                group?.data?.videos.map( (vid,i) =>               
                    <div key = {i}>
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
                onClick={nextPage}
            >
                Load More
            </button>
        </div>
    )
} 

  export default AllVideos;
