import style from "./ProfileImage.module.css"
import {useEffect, useRef, useState} from "react"
import {useUploadImage, useUpdateUserData } from "../../hooks/mutationHooks"

export default function ProfileImage({image,closeModal,reset,setImageFile,username}){
    const profile = useRef()
    const container = useRef()
    const circle = useRef()
    const circleBound = useRef({})
    const imageOffset = useRef({})
    const containerRect = useRef({})
    //Meididas originales de la imagen 
    const imageDimensions = useRef()
    const [imgPositionX,setImgPositionX] = useState({
        transform: '-50%',
        left: '50%'
    })
    const [imgPositionY,setImgPositionY] = useState({
        transform: '-50%',
        top: '50%'
    })
    const [imageSize, setImageSize] = useState({
        height: 'auto',
        width: 'auto'
    })
    //Estado local donde almacenar los parametros que se enviaran a cloudinary
    const [cloudTransformations,setCloudTransformations] = useState({
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    })
    const zoom = (e)=>{
        getCircleBounds()
        const imageRect = profile.current.getBoundingClientRect()//medidas actuales
        if(e.target.name === "zoomin"){
            setImageSize({
                    height: imageRect.height + 10 + 'px',//heigh futuro
                    width: 'auto'
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
    useEffect(()=>{
        const imageRect = profile.current.getBoundingClientRect()//medidas actuales
        //Posicion de la imagen respecto del contenedor sin mover con el mouse
        // const topStatic = imageRect.top - containerRect.current.top
        // const leftStatic = imageRect.left - containerRect.current.left
        const bottomStatic = imageRect.bottom - containerRect.current.top
        const rightStatic = imageRect.right - containerRect.current.left
        //Reposicionamiento en caso de que los bordes de laimagen toquen traspasen los limites del circulo hacia adentro cuando se modifica sus dimensiones
        if(bottomStatic <= circleBound.current.bottom){
            // console.log('tocando bottom')
            setImgPositionY({
                transform: 0,
                top: circleBound.current.bottom - imageRect.height - 1 + 'px',
            })
        }
        if(rightStatic <= circleBound.current.right){
            // console.log('tocando right')
            setImgPositionX({
                transform: 0,
                left: circleBound.current.right - imageRect.width - 1 + 'px',
            })
        }
    },[imageSize])
    
    const saveCoords = (e)=>{
        e.preventDefault()
        const {positionX,positionY} = imageOffset.current
        const imageRect = profile.current.getBoundingClientRect()
        // Se determina la posicion que va a tener la imagen en relacion a la posicion dinamica del puntero del raton
        const top =  e.clientY - containerRect.current.y - positionY 
        const left = e.clientX - containerRect.current.x - positionX
        const bottom = top + imageRect.height 
        const right = left + imageRect.width 

        //Ratio de la operacion de dividir el ancho original con la medida del ancho de la imagen redimensionada en la interfaz del navegador
        const imageRatio = imageDimensions.current.originalWidth / imageRect.width
        //En la interfaz, margen TOP del circulo dentro de la imagen redimensionada
        const circleMarginTop = circleBound.current.top - top
        //Medida real del margen TOP del circulo respecto de la imagen, medida que se pasa como parametro a cloudinary
        const realMarginTop = circleMarginTop * imageRatio
        //En la interfaz, margen LEFT del circulo dentro de la imagen redimensionada
        const circleMarginLeft = circleBound.current.left - left
        //Medida real del margen LEFT del circulo respecto de la imagen, medida que se pasa como parametro a cloudinary
        const realMarginLeft = circleMarginLeft * imageRatio
        //Medidas reales del circulo
        const realCircleWidth = circleBound.current.width * imageRatio
        const realCircleHeight = circleBound.current.height * imageRatio

        //Restricciones de moviento cuando el borde de la imagen toca uno de los bordes del circulo
        //Cuando toca el borde left
        if(circleBound.current.left <= left){
            setImgPositionX({
                transform: 0,
                left: circleBound.current.left - 1 + 'px',
            })
            setImgPositionY({
                transform: 0,
                top: top + 'px',
            })
             //Parametros que se le pasaran a Cloudinary 
            if(circleBound.current.top <= top){
                // console.log('tocando top y left')
                setCloudTransformations({
                    top: 0,
                    left: 0,
                    width: Math.floor(realCircleWidth),
                    height: Math.floor(realCircleHeight)
                })
            }
            if(circleBound.current.bottom >= bottom){
                // console.log('tocando bottom y left')
                setCloudTransformations({
                    top: Math.floor(imageDimensions.current.originalHeight - realCircleHeight),
                    left: 0,
                    width: Math.floor(realCircleWidth),
                    height: Math.floor(realCircleHeight)
                })
            }
            if(
                !(circleBound.current.top <= top)
                &&
                !(circleBound.current.bottom >= bottom)
                ){
                // console.log('tocando solo left')
                setCloudTransformations({
                    top: Math.floor(realMarginTop),
                    left: 0,
                    width: Math.floor(realCircleWidth),
                    height: Math.floor(realCircleHeight)
                })
            }
        }
        //cuando tocan borde derecho
        if(circleBound.current.right >= right){
            setImgPositionX({
                transform: 0,
                left: circleBound.current.right - imageRect.width + 'px',
            })
            setImgPositionY({
                transform: 0,
                top: top + 'px',
            })
            //Parametros que se le pasaran a Cloudinary
            if(circleBound.current.top <= top){
                // console.log('tocando top y right')
                setCloudTransformations({
                    top: 0,
                    left: Math.floor(imageDimensions.current.originalWidth - realCircleWidth),
                    width: Math.floor(realCircleWidth),
                    height: Math.floor(realCircleHeight)
                })
            }
            if(circleBound.current.bottom >= bottom){
                // console.log('tocando bottom y right')
                setCloudTransformations({
                    top: Math.floor(imageDimensions.current.originalHeight - realCircleHeight),
                    left: Math.floor(imageDimensions.current.originalWidth - realCircleWidth),
                    width: Math.floor(realCircleWidth),
                    height: Math.floor(realCircleHeight)
                })
            }
            if(
                !(circleBound.current.top <= top)
                &&
                !(circleBound.current.bottom >= bottom)
            ){
                // console.log('tocando solo right')
                setCloudTransformations({
                    top: Math.floor(realMarginTop),
                    left: Math.floor(imageDimensions.current.originalWidth - realCircleWidth),
                    width: Math.floor(realCircleWidth),
                    height: Math.floor(realCircleHeight)
                })
            }
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
                // console.log('tocando solo top')
                setCloudTransformations({
                    top: 0,
                    left:  Math.floor(realMarginLeft),
                    width: Math.floor(realCircleWidth),
                    height: Math.floor(realCircleHeight)
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
                // console.log('tocando solo bottom')
                setCloudTransformations({
                    top: Math.floor(imageDimensions.current.originalHeight - realCircleHeight),
                    left:  Math.floor(realMarginLeft),
                    width: Math.floor(realCircleWidth),
                    height: Math.floor(realCircleHeight)
                })
            }
            setImgPositionY({
                transform: 0,
                top:  circleBound.current.bottom - imageRect.height + 'px',
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
            setCloudTransformations({
                top: Math.floor(realMarginTop),
                left: Math.floor(realMarginLeft),
                width: Math.floor(realCircleWidth),
                height: Math.floor(realCircleHeight)
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
        const imageRect = profile.current.getBoundingClientRect()
        //posicion del cursor respecto de la imagen
        imageOffset.current = {
            positionX:  e.clientX - imageRect.x,
            positionY: e.clientY - imageRect.y
        }
        getCircleBounds()
        document.onmousemove = saveCoords
    }
   
    useEffect(()=>{
        console.log("componente montado")
        document.onmouseup = (e)=>{
            e.preventDefault()
            profile.current.style.cursor = 'grab'
            document.body.style.cursor = 'auto'
            document.onmousemove = null
        }
    },[])

    //Funcion para redimensiona imagen despues del renderiizado inicial
    const [redimention,setRedimention] = useState(true)
    useEffect(()=>{
        if(redimention){
            getCircleBounds()
   
            const imageRatio = profile.current.width / profile.current.height
            let width, height

            //Si la imagen es mas alta que la medida del contenedor
            if (imageRatio <= 1) {
                width = circleBound.current.width;
                height = Math.floor(circleBound.current.width / imageRatio);
                //Seteo del verdadero estado inicial
                setCloudTransformations({
                    top: Math.floor((profile.current.height - profile.current.width) / 2),
                    left: 0,
                    width: profile.current.width,
                    height:  profile.current.width, 
                })
            }
            //Si la imagen es mas ancha se guardan los parame
            else {
                width = Math.floor(circleBound.current.height * imageRatio);
                height = circleBound.current.height;
                 //Seteo del verdadero estado inicial
                setCloudTransformations({
                    top:  0,
                    left: Math.floor((profile.current.width - profile.current.height) / 2),
                    width: profile.current.height,
                    height: profile.current.height, 
                })
            }
            imageDimensions.current = {
                originalWidth: profile.current.width,
                originalHeight: profile.current.height,
            }
            setImageSize({
                height: height +'px',
                width: width + 'px'
            })
            profile.current.style.display = 'block'
            setRedimention(false)
        }
    },[])

    //Hook que se encarga de la subida de la imagen a la API de Cloudinary
    const {mutate:mutateUploadImage} = useUploadImage()

    //Hook que envia la informacion necesaria para actualizar el estado del usuario en el servidor 
    const {mutate:mutateUpdateUserData} = useUpdateUserData()

    const changeUserAvatar = () => mutateUploadImage({
        image,
        params: {
            eager:
            `c_crop,h_${cloudTransformations.height},` +
            `w_${cloudTransformations.width},` + 
            `x_${cloudTransformations.left},` +
            `y_${cloudTransformations.top}/` +
            `ar_1.0,`+
            `h_100,` +
            `r_max,` +
            `f_auto/`,
            folder: 'user_profile_images',
            public_id: username
        }
    },{
        //llamamos a la mutacion que actualiza el estado del usuario en el servidor
        onSuccess: data => mutateUpdateUserData({
            image: data.data.eager[0].url,
            username
        },{
            onSettled: () => closeModal(false),    //se cierra la ventana del modal
            onError: (error) => alert('Something went wrong while updating user: ' + ' ' + error)
        }),    
        //Funcion que se ejecuta en caso de que la subida de la imagen a Cloudinary haya salido mal
        onError: (error) => alert('Something went wrong while uploading image' + ' ' + error)
    })
    
    return (    
        <div className={style.modalBackground}>
            <div className={style.modalContainer}>
                <div className={style.modalImageContainer} ref={container}>
                    <img
                        src={image}
                        ref={profile}
                        onMouseDown={grabImage}
                        draggable="false"
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
                    <button onClick={changeUserAvatar}>Accept</button>
                    <button onClick={()=> {closeModal(false); reset(); setImageFile(null)}}>Cancel</button>
                </div>
            </div>
        </div>
    )
}