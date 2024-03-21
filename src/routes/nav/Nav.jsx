import React,{useEffect, useRef, useState} from 'react'
import style  from './Nav.module.css'
import imageDefault from "../../assets/profile-image.png"
import { useNavigate, Link, useLocation } from 'react-router-dom'
import useLogout from '../../hooks/useLogout'
import useUser from '../../hooks/useUser'
import notifications from "../../assets/notifications_bell.png"

export default function Nav() {

  const { data, isSuccess, isLoading, isFetching } = useUser()

  const [showNotifications,setShowNotifications] = useState('hidden')
  const user = data?.data
  const { mutate } = useLogout()
  const navigate = useNavigate()
  const {pathname} = useLocation()
  //Estado inicial para determinar la Posicion inicial de la lista de notificationes
  const [notificationsPosition,setNotificationsPosition] = useState({
    top: 0,
    left: 0
  })
  const notificationsBell = useRef()
  const notificationsList = useRef()

  const attachToBell = (e)=>{
    const bellRect = notificationsBell.current.getBoundingClientRect()
    const notificationsListRect = notificationsList.current.getBoundingClientRect()
    setNotificationsPosition({
      top: bellRect.top,
      left: bellRect.left - notificationsListRect.width,
    })
  } 

  const notificationsFrame = ()=>{
    setShowNotifications(prev => {
      if(prev === 'hidden') return 'visible'
      else{return 'hidden'}
    })
    attachToBell()
  }

  window.onresize = attachToBell
  window.onscroll = attachToBell

  document.onclick = (e)=>{
    if(e.target.parentNode !== notificationsList.current && e.target !== notificationsBell.current.firstChild){
      setShowNotifications('hidden')
    }
  }
 
  const logout = (e)=>{
    e.preventDefault()
    mutate(null,{
      onSuccess: ()=>{
       navigate('/')
      }
    })
  }

  const title = (
    <h1 onClick={()=>navigate("/")}>MatiVid</h1>
  )
  return (
    <div className= {style.nav} >
        {title}
        <div >
          <button>search</button>
          <input type="text" />
        </div>
          
          <div className={style.clickScreen}>
            <ul
              className={style.listOfNotifications}
              ref = {notificationsList} 
              style={{
                  top: notificationsPosition.top + 'px',
                  left: notificationsPosition.left + 'px',
                  visibility: showNotifications
                }}
              onClick = {()=> console.log('haciendo click en la lista de notificaciones')}
            >
              <li>"User1" has uploaded new video "Video Name" </li>
              <li>"User2" responded your comment</li>
              <li>"User3" has subscribed to your channel</li>
              <li>"User4" has liked your video</li>
            </ul>
          </div>
        
      {
        isSuccess ?
            <div className={style.userProfile}>

              {/*Campana de notificaciones*/}

              <div className={style.notificationsBell} ref={notificationsBell} onClick={notificationsFrame}>
                <img src={notifications} />
              </div>
            
              <Link to="/create" style={{postion:'relative'}}>
                <button className={pathname === "/create" ? style.selected : style.normal}>UploadVideo</button>
              </Link>

                <span className={style.profileSocket} onClick={()=>navigate(`/channel/${user.username}`)}>
                  <img src={ user?.image || imageDefault } />
                  <p>{`${user?.username}`}</p>
                </span>
              
                <div>
                  <button onClick={logout}>Logout</button>
                </div>
                
            </div>
        :
            <span className={style.userProfile}>
              <button onClick={()=> navigate('/signin')}>Login</button>
              <button onClick={()=> navigate('/signup')}>Register</button>
            </span>
      }
  </div>
  )
}
