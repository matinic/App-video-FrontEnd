import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import ErrorPage from "./error-page";
import Signup from './routes/signup/Signup.jsx'
import Signin from './routes/signin/Signin';
import UploadVideo from './routes/create/UploadVideo';
import Root from './routes/Root';
import Detail from './routes/detail/Detail';
import Channel from "./routes/channel/Channel.jsx"
import Home from './routes/public/Public.jsx';
import Search from './routes/search/Search.jsx';

const queryClient = new QueryClient()
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root/>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home/>
      },
      {
        path: '/search/:query',
        element: <Search/>
      },
      {
        path: 'create',
        element: <UploadVideo/>
      }, 
      {
        path: 'signin',
        element: <Signin/>
      },
      {
        path:"signup",
        element:<Signup/>,
      },  
      {
        path:"detail/:id",
        element:<Detail/>,
      },
      {
        path:"channel/:username",
        element:<Channel/>,
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
     </QueryClientProvider>
  </React.StrictMode>,

)
