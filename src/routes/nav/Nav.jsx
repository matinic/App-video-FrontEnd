import React from 'react'
import style  from './Nav.module.css'
import imageDefault from "../../assets/profile-image.png"
import { useNavigate, Link, useLocation } from 'react-router-dom'
import useLogout from '../../hooks/useLogout'
import useUser from '../../hooks/useUser'

export default function Nav() {

  const { data, isSuccess, isLoading, isFetching } = useUser()

  const user = data?.data
  
  const { mutate } = useLogout()

  const navigate = useNavigate()

  const {pathname} = useLocation()

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
      <div className={style.navContent}>
          {title}
          <div >
            <button>search</button>
            <input type="text" />
          </div>
      {
        isSuccess ?
            <div className={style.userProfile}>
            
                <Link to="/create">
                  <button className={pathname === "/create" ? style.selected : style.normal}>UploadVideo</button>
                </Link>

              {
                isLoading || isFetching ?
                  <p>Loading Profile...</p>
                : 
                <span className={style.profileSocket} onClick={()=>navigate(`/channel/${user.username}`)}>
                  <img src={ user?.image || imageDefault } />
                  <p>{`${user?.username}`}</p>
                </span>
              }

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
  </div>
  )
}
