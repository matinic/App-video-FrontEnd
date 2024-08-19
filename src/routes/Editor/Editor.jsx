import React,{useEffect, useRef, useState} from 'react'
import AvatarEditor from 'react-avatar-editor'
import { Slider } from '@mui/material'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { CircularProgress } from '@mui/material';
import { useUpdateUserData, useUploadImage } from '../../hooks/mutationHooks';
import { useUser } from "../../hooks/queryHooks"

function Editor({onClose,open}) {

const [zoom,setZoom] = useState( 1.2 )

const [imageFile, setImageFile] = useState()

const [clickOnInput,setClickOnInput] = useState(true)

const [showModal, setShowModal] = useState(false)

const {data:user} = useUser()

const {mutate:uploadImage,isLoading:isUpImage} = useUploadImage()

const {mutate:updateUser} = useUpdateUserData()

const inputFile = useRef()

const editorRef = useRef(null)

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#262626',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const loadImage = (e)=>{
  const file = e.target.files[0]
  const reader = new FileReader()
  reader.onloadend = ()=>{
      setImageFile(reader.result)
  }
  reader.readAsDataURL(file)
}

useEffect(()=>{
  console.log("ejecutando effect")
  if(open && clickOnInput){
    inputFile.current.click()
    setClickOnInput(false)
  } 
  if(imageFile){
    setShowModal(true)
  }
  if(!open && !clickOnInput ){
    inputFile.current.value = ""
    setImageFile(null)
    setShowModal(false)
    setClickOnInput(true)
  }
},[imageFile,open])
console.log(imageFile)
const zoomHandler = (e,newValue)=>{
  setZoom(newValue)
}
const cropAndUpload = () => {
  if (editorRef.current) {
    // Obtén el canvas con la imagen recortada
    const canvas = editorRef.current.getImageScaledToCanvas();

    // Convertir el canvas a un DataURL (base64)
    const imageURL = canvas.toDataURL();
    canvas.toBlob( () => uploadImage({
          image: imageURL,
          params: {
              eager:
            `r_max,` +
            `f_auto/`,
            folder: 'user_profile_images',
            public_id: user.data.username
            }
          },{
            onSuccess: (data) => { 
                updateUser({
                  image: data.data.eager[0].url,
                  username: user.data.username
                })
                onClose()
            }
          })
    )
  }

}

return (
  <>
    <input
        type="file"
        ref={inputFile}
        onChange={loadImage}
        style={{display: "none"}}
    />
    <Modal open={showModal} onClose={onClose}>
      <Box
        sx={{ ...style, width: 400 }}
        position="relative" 
        alignItems="center"
        display="flex"
        flexDirection="column"
      >
        <Box 
           position="relative" 
           display="flex" 
           justifyContent="center" 
           alignItems="center"
        >
            <AvatarEditor
              ref={editorRef}
              image={imageFile}
              width={250}
              height={250}
              border={20}
              color={[255, 255, 255, 0.6]} // RGBA
              scale={zoom}
              rotate={0}
              borderRadius={125}
            />
          <Box position="absolute">
            {
              isUpImage && <CircularProgress color="secondary"/>
            }
          </Box>
        </Box>
        {
        !isUpImage &&
          <>
            <Slider
              defaultValue = {1}
              value={zoom}
              onChange={zoomHandler}
              min = {1}
              max = {5}
              step = {0.01}
            />
            <Stack spacing={2} direction="row" justifyContent="center">
              <Button onClick={cropAndUpload}>Accept</Button>
              <Button onClick={onClose}>Cancel</Button>
            </Stack>
          </>
        }
      </Box>
    </Modal>
  </>
  )
  
}

export default Editor