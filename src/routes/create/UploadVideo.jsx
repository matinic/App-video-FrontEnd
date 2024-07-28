import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useUploadVideo, useCreateVideo } from "../../hooks/mutationHooks"
import { useUser } from '../../hooks/queryHooks'
import style from './UploadVideo.module.css'
import { io, Manager } from "socket.io-client";

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
    published: '',
    url: ''
  })

  const { isSuccess } = useUser()
  
  const [error, setError] = useState({})

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

  const { mutate:upload, isLoading, isSuccess:isUploadSuccess } = useUploadVideo()

  const { mutate:submit } =  useCreateVideo()

  const [ video, setVideo ] = useState('')

  const fileHandler = async (e) => {
    const archive = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setVideo(reader.result);
      setError(prev => ({
          ...prev,
          url: ''
        }))
    };
    reader.readAsDataURL(archive);
  };

  const uploadVideoHandler = async(e)=>{
    e.preventDefault()
    upload(video, {
      onSuccess: ({data})=>{
        setForm(prev => ({...prev, url : data.url}))
      },
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
    onSuccess: (data)=>{
      navigate(`/detail/${data.data.video.id}`)
    }
  })
  setError(errorFactory())
},[form])

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

                        <input type="file" onChange={fileHandler}/>
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

                        <button disabled={Object.keys(error).length}>OK</button>
                    
                        {
                          isLoading ? <div>Uploading...</div> : null
                        }
                    </fieldset>
                </form>
        </div>
        : null
      } 
    </>
    

  )
}
