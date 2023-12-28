import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import Nav from "./nav/Nav";
import Videos from "./videos/Videos";

export default function Root() {

  const {pathname} = useLocation()

    return (
      <div>
        
        <Nav/>
        {
          pathname === "/"?
          <Videos/>:null
        }
        <Outlet/>
        
      </div>
    )
  
  }