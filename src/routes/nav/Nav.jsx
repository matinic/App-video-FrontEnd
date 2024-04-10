import React,{useEffect, useRef, useState} from 'react'
import style  from './Nav.module.css'
import imageDefault from "../../assets/profile-image.png"
import { useNavigate, Link, useLocation } from 'react-router-dom'
import useLogout from '../../hooks/useLogout'
import useUser from '../../hooks/useUser'
import notifications from "../../assets/notifications_bell.png"
import logoutIcon from "../../assets/logout.png"


export default function Nav() {

  const [userOpt,setUserOpt] = useState("none")

  const { data, isSuccess, isLoading, isFetching } = useUser()

  const profileMenu = useRef()

  const profileImage = useRef()

  //This hide the floating user's menu when the outside is clicked
  useEffect(()=>{
    const handler = (e)=>{
      if(!profileMenu.current?.contains(e.target) && e.target !== profileImage.current && profileMenu.current){
        setUserOpt("none")
        // console.log("evento ejecutandose")
      }
    }
    document.addEventListener('click',handler)
  },[])
  


  const [showNotifications,setShowNotifications] = useState("none")
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

  return (
    <div className= {style.nav} >

      {/*Website Name*/}
      <h1
        className={style.title}
        onClick={()=>navigate("/")}
      >
        MyVid
      </h1>

      <div className={style.navButtonsContainer}>     
         
        {/*Upload button*/}
        <Link
          to="/create"
          style={{postion:'relative'}}
        >
          <p className={style.button} name="upload">Upload</p>
        </Link>

        {/* Search bar */}
        <div className={style.searchBar} >
          <p className={style.searchButton}>Search</p>
          <input type="text" />
        </div>

        {
          isSuccess ?
            <>
              {/*Notifications bell*/}
              <img src={notifications} className={style.notificationsBell} ref={notificationsBell} onClick={notificationsFrame}/>

              {/*Notification's List */}
              <ul
                className={style.listOfNotifications}
                ref = {notificationsList} 
                style={{
                    top: notificationsPosition.top + 'px',
                    left: notificationsPosition.left + 'px',
                    visibility: showNotifications
                  }}
              >
              </ul>

              {/*User profile Image*/}
              <img
                src={ user?.image || imageDefault }
                className={style.imageProfile}
                onClick={ ()=> setUserOpt(userOpt === "none" ? "" : "none") }
                ref={profileImage}
              />

              {/*User Profile nav buttons*/}
              <ul className={style.userProfileButtons} data-display={userOpt} ref={profileMenu}>
                  <li
                    className={style.button}
                    name="profile"
                    onClick={ () => navigate(`/channel/${user.username}`) }
                  >
                    <img
                      src={ user?.image || imageDefault }
                      className={style.imageProfile}
                    />
                    {user.username}
                  </li>
                  <li className={style.button} name="logout">
                    <img src={logoutIcon} alt="" name="logout"/>
                    Log Out
                  </li>
              </ul>
            </>
          :
            <>
              <p onClick={()=> navigate('/signin')} name="signin" className={style.button}>Signin</p>
              <p onClick={()=> navigate('/signup')} name="signup" className={style.button}>Signup</p>
            </>
        }
      </div>
  </div>
  )
}
