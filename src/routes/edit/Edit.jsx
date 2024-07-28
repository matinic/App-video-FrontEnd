import React from 'react'
import style from './Edit.module.css'
import { useEditVideo } from '../../hooks/mutationHooks'

export default function Edit({close,videoInfo}) {

  const [form,setForm] = React.useState({
    id: videoInfo.id,
    title: videoInfo.title,
    description: videoInfo.description,
  })

  const [error,setError] = React.useState({})

  const {mutate:edit} = useEditVideo()

  const validation = ()=>{
    let error = {}
    const exp = /^\s*(?=.*[a-zA-Z]).*$/
    if(!exp.test(form.title)) error.title ="Invalid Title"
    return error
  }

  const handleForm = (e)=>{
    e.preventDefault()
    setForm({
      ...form,
      [e.target.name] : e.target.value
    })
  }
  React.useEffect(()=>{
    setError(validation(error))
  },[form])

  const [mouse,setMouse] = React.useState(false)

  const mousedownHandler = (e)=>{
    if(e.target === e.currentTarget){
      setMouse(true)
    }
  }
  const mouseupHandler = (e)=>{
    if(e.target === e.currentTarget){    
      if(mouse){
        close(false)
      }
    }
  }
  
  return (
    <div className={style.modalBackground} 
      onMouseDown={mousedownHandler}
      onMouseUp={mouseupHandler}
    >
      <form className={style.formContainer} >
    
        <div className={style.title}>
          <label htmlFor="title">Title</label>
          <input type="text" name='title' value={form.title} onChange={handleForm}/>
          <p className={style.error}>{error?.title && error.title}</p>
        </div>
        <div className={style.description}>
          <label>Description</label>
          <textarea value={form.description} name="description" onChange={handleForm}></textarea>
        </div>
        <div className={style.decisionButtons}>
          <button
            type='button'
            disabled={Object.keys(error).length}
            onClick={()=>edit(form,{
              onSuccess: ()=>close(false)
            })}
          >Accept</button>
          <button onClick={
            (e)=>{
                e.preventDefault()
                close(false)}
              }
          >
                Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
