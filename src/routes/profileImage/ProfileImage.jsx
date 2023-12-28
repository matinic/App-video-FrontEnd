import style from "./ProfileImage.module.css"
import {useEffect, useRef, useState} from "react"
import useCloudinarySignature from "../../hooks/useCloudinarySignature"
import useUploadImage from "../../hooks/useUploadImage"

export default function ProfileImage({image,closeModal,reset,setImageFile}){
    const profile = useRef()
    const container = useRef()
    const circle = useRef()
    const circleBound = useRef({})
    const imageOffset = useRef({})
    const containerRect = useRef({})
    useCloudinarySignature()

    const [imgPositionX,setImgPositionX] = useState({
        transform: '-50%',
        left: '50%'
    })
    const [imgPositionY,setImgPositionY] = useState({
        transform: '-50%',
        top: '50%'
    })
    const [imageSize, setImageSize] = useState({
        height: '100%',
        width: 'auto'
    })
    const zoom = (e)=>{
        getCircleBounds()
        const imageRect = profile.current.getBoundingClientRect()//medidas actuales
        if(e.target.name === "zoomin"){
            setImageSize({
                    height: imageRect.height + 10 + 'px',//heigh futuro
                    width:'auto',//width futuro
                })
            }
        else if(e.target.name === "zoomout"){
            if(imageRect.height <= circleBound.current.height || imageRect.width <= circleBound.current.width ) return
            setImageSize({
                    height: imageRect.height - 10 + 'px',
                    width: 'auto'
                })
            }
        return
    }

    const saveCoords = (e)=>{
        e.preventDefault()
        const {positionX,positionY} = imageOffset.current
        const imageRect = profile.current.getBoundingClientRect()
        // console.log(e.clientX - containerRect.current.x - positionX)
        const top =  e.clientY - containerRect.current.y - positionY
        const left = e.clientX - containerRect.current.x - positionX
        const bottom = top + imageRect.height + 2
        const right = left + imageRect.width 
        //cuando toca el borde izquierdo
        if(circleBound.current.left <= left){
            setImgPositionX({
                transform: 0,
                left: circleBound.current.left - 1 + 'px',
            })
            setImgPositionY({
                transform: 0,
                top: top + 'px',
            })
        }
        //cuando tocan borde derecho
        if(circleBound.current.right >= right){
            setImgPositionX({
                transform: 0,
                left: circleBound.current.right - imageRect.width - 1 + 'px',
            })
            setImgPositionY({
                transform: 0,
                top: top + 'px',
            })
        }
        //cuando toca borde top
        if(circleBound.current.top <= top){
            if(
                !(circleBound.current.left <= left)
                &&
                !(circleBound.current.right >= right)
            ){
                setImgPositionX({
                    transform: 0,
                    left: left + 'px',
                })
            }
            setImgPositionY({
                transform: 0,
                top:  circleBound.current.top + 'px',
            })
        }
        //cuando toca borde bottom
        if(circleBound.current.bottom >= bottom){
            if(
                !(circleBound.current.left <= left)
                &&
                !(circleBound.current.right >= right)
            ){
                setImgPositionX({
                    transform: 0,
                    left: left + 'px',
                })
            }
            setImgPositionY({
                transform: 0,
                top:  circleBound.current.bottom - imageRect.height - 2 + 'px',
            })
        }
        //cuando no toca ningun borde y se mueve libremente
        if(
            !(circleBound.current.left <= left)
            &&
            !(circleBound.current.top <= top) 
            &&
            !(circleBound.current.right >= right)
            &&
            !(circleBound.current.bottom >= bottom)
        ){
            setImgPositionX({
                    transform: 0,
                    left: left + 'px',
            })
            setImgPositionY({
                    transform: 0,
                    top: top + 'px',
            })
        }
        return 
    }
    const getCircleBounds = ()=>{
        const circleRect = circle.current.getBoundingClientRect()
        const containerData = container.current.getBoundingClientRect()
        circleBound.current = {
            width: circleRect.width,
            height: circleRect.height,
            left : circleRect.left - containerData.left,
            right : circleRect.right - containerData.left,
            top :  circleRect.top - containerData.top,
            bottom : circleRect.bottom - containerData.top
        }
        containerRect.current = containerData
    }
    const grabImage = (e)=>{
        document.body.style.cursor = 'grabbing'
        e.target.style.cursor = 'grabbing'
        const imageRect = profile.current.getBoundingClientRect()
        //posicion del cursor respecto de la imagen
        imageOffset.current = {
            positionX:  e.clientX - imageRect.x,
            positionY: e.clientY - imageRect.y
        }
        getCircleBounds()
        document.onmousemove = saveCoords
    }
   
    document.onmouseup = (e)=>{
        e.preventDefault()
        profile.current.style.cursor = 'grab'
        document.body.style.cursor = 'auto'
        document.onmousemove = null
    }
    //Funcion para redimensionar imagen durante el renderiizado inicial
    const [redimention,setRedimention] = useState(true)
    useEffect(()=>{
        if(redimention){
            console.log('redimensionando imagen')
            getCircleBounds()
            const imageRatio = profile.current.width / profile.current.height
            let width, height
            if (imageRatio <= 1) {
                width = circleBound.current.width;
                height = circleBound.current.width / imageRatio;
            } else {
                width = circleBound.current.height * imageRatio;
                height = circleBound.current.height;
            }
            setImageSize({
                height: height +'px',
                width: width + 'px'
            })
            setRedimention(false)
        }
    },[])

    const {mutate:mutateUploadImage} = useUploadImage()
    const acceptAndUploadToCloudinary = ()=>{
        mutateUploadImage(image,{
            onSuccess: (a,b,c)=>{ 
                console.log('archivo subido exitosamente a cloudinary')
                console.log(a)
                console.log(b)
                console.log(c)
            }
        })
    }

    return (    
        <div className={style.modalBackground}>
            <div className={style.modalContainer}>
                <div className={style.modalImageContainer} ref={container}>
                    <img
                        src={image}
                        ref={profile}
                        onMouseDown={grabImage}
                        style={
                            {
                                transform: `translate(${imgPositionX.transform},${imgPositionY.transform})`,
                                left: imgPositionX.left,
                                top: imgPositionY.top,
                                height: imageSize.height,
                                width: imageSize.width,
                            }
                        }    
                    />
                    <div className={style.backgroundMask}></div>
                    <div className={style.circle} ref={circle}></div>
                </div>
                <div className={style.buttonsContainer}>
                    <button name="zoomin" onClick={zoom}>Zoom +</button>
                    <button name="zoomout" onClick={zoom}>Zoom -</button>
                    <button onClick={acceptAndUploadToCloudinary}>Accept</button>
                    <button onClick={()=> {closeModal(false); reset(); setImageFile(null)}}>Cancel</button>
                </div>
            </div>
        </div>
    )
}