import React from 'react'
import style from "./Subscriptors.module.css"

function Subscriptors({followers, closeButton}) {

    return (
      <div className={style.modalBackground} onClick={(e)=>{
          if(e.target === e.currentTarget) closeButton(false)
        }}>
        <div className={style.modalContainer}>
            <button onClick={()=> closeButton(false)}>close</button>
            <h3>Followers</h3>
            {
              followers?.map((follower,i) =>
                < div key={i}>
                  <img src={follower.image}/>
                  <div>{follower.username}</div>
                </div>
              )
            }
        </div>
      </div>
    )
  

}

export default Subscriptors