import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { useCreateVideo, useUploadVideo } from "../../hooks/mutationHooks"
import { useUser } from '../../hooks/queryHooks'
import style from './UploadVideo.module.css'
import { io, Manager } from "socket.io-client";
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import { Box, Typography } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';


export default function UploadVideo() {

  const socektIo = ()=>{
    const manager = new Manager("http://localhost:3001")
    const socket = manager.socket("/")
    socket.on("connect",()=>{
      console.log("conexion establecida con el servidor")
    })
    // socket.emit("hola", "mensaje del cliente");
  }
  
  const navigate = useNavigate()

  const [form,setForm] = useState({
    title: '',
    description: '',
    poster: '',
    published: '',
    url: ''
  })

  const [error, setError] = useState({})

  const [progress, setProgress] = useState()
  
  const { isSuccess } = useUser()

  const abortRef = useRef()

  const { mutate:upload, isLoading, isSuccess:isUploadSuccess } = useUploadVideo(setProgress,abortRef)

  const { mutate:submit } =  useCreateVideo()

  const [ video, setVideo ] = useState('')

  const [videoData,setVideoData] = useState({name: "", size: ""})

  const formHandler = ({target}) => {
      setForm(prev => ({...prev, [target.name] : target.value}) )
    }

 const errorFactory =()=>{
  const error = {}
    if(!form.title) error.title = "Write a title"
    if(!video) error.url = "Select a file"
    if(!Boolean(form.published.toString())) error.published = "Select an option"
    return error
  }

  const fileHandler = async (e) => {
    const archive = e.target.files[0];
    const fileName = e.target.files[0]?.name;
    const fileSize = (e.target.files[0].size / (1024 * 1024)).toFixed(2) + ' MB';
    setVideoData({
      name: fileName,
      size: fileSize
    })
    setForm(prev => ({...prev, title: fileName}))
    const reader = new FileReader();
    reader.onloadend = () => {
      setVideo(reader.result);
    };
    reader.readAsDataURL(archive);
  };

  const uploadVideoHandler = async(e)=>{
    e.preventDefault()
    upload(video, {
      onSuccess: data => {
        setForm( prev => ({
            ...prev,
            url : data.data.eager[0].secure_url,
            poster: data.data.eager[1].secure_url
          })
        )
      },
      onError: error => {
        console.log(error)
      }
    })
  }

const Error = (prop)=>{
  const {message}  = prop
  return(
      <div style={{color:'red'}}>
          {message ? message : null}
      </div>
  )
}

useEffect(()=>{
  if(isUploadSuccess) submit(form,{
    onSuccess: data =>{
      navigate(`/detail/${data.data.video.id}`)
    }
  })
  setError(errorFactory())
  return () => setProgress(0)
},[form,video])



  return (
    <>
    <button onClick={()=>{
      console.log('enviando mensaje')
      socket.emit("hola","Hola desde el cliente")
    }}>Saludar al servidor</button>
      {
        isSuccess ?
        <div className={style.formContainer}>
                <form onSubmit={uploadVideoHandler} className={style.formBody}>
                    <fieldset>
                        <legend>Upload your video</legend>

                        {
                        !isLoading &&
                          <>
                            <Button
                              component="label"
                              role={undefined}
                              variant="contained"
                              tabIndex={-1}
                              startIcon={<CloudUploadIcon />}
                            >
                              Select File
                              <input type="file" onChange={fileHandler} style={{display:"none"}} accept="video/*"/>
                            </Button>
                            <Typography>{videoData.size}</Typography>
                          </>
                        }
                        <Error message={error?.url}/>

                        <label>Title</label>
                        <input type="text" value={form.title} onChange={formHandler} name= 'title'/>
                        <Error message={error?.title}/>

                        <label>Description</label>
                        <textarea type="text" value={form.description} onChange={formHandler} name= 'description'/>

                        <fieldset
                          onChange={(e)=> setForm(prev => ({...prev, published : "true" === e.target.value}))}
                        >
                          <legend>public</legend>
                          <div>
                            <input
                              type="radio"
                              id="yes"
                              name="published"
                              value={"true"}
                            />
                            <label htmlFor="yes">
                              YES
                            </label>
                          </div>
                          <div>
                            <input
                              type="radio"
                              id="no"
                              name="published"
                              value={"false"}
                            />
                            <label htmlFor="no">
                              NO
                            </label>
                          </div>
                          <Error message={error?.published}/>
                        </fieldset>
                    
                        {
                          isLoading ?
                              <Box>
                                <Stack display={"flex"} direction={'row'} gap={"5px"} alignItems={"center"}>
                                  <LinearProgress
                                    variant="determinate"
                                    value={progress}
                                    sx={{flexGrow:1}}
                                  />
                                  <Typography>{progress}%</Typography>
                                </Stack>
                                  <Button variant="contained" onClick={abortRef.current}>Cancel</Button>
                              </Box>
                            : 
                              <button disabled={Object.keys(error).length}>OK</button>
                        }
                    </fieldset>
                </form>
        </div>
        : null
      } 
    </>
    

  )
}
