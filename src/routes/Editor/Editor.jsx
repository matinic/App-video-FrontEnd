import React,{useEffect, useRef, useState} from 'react'
import AvatarEditor from 'react-avatar-editor'
import { Slider } from '@mui/material'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { CircularProgress } from '@mui/material';
import { useUpdateUserData, useUploadImage } from '../../hooks/mutationHooks';
import { useUser } from "../../hooks/queryHooks"
import GenericModal from '../genericModal/GenericModal';

function Editor({onClose,image}) {

const [zoom,setZoom] = useState( 1.2 )

const {data:user} = useUser()

const {mutate:uploadImage,isLoading:isUpImage} = useUploadImage()

const {mutate:updateUser} = useUpdateUserData()

const editorRef = useRef(null)

const zoomHandler = (e,newValue) => {
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
          }},{
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
  <GenericModal onClose={onClose} open = {!!image}>
          <Box 
           position="relative" 
           display="flex" 
           justifyContent="center" 
           alignItems="center"
        >
            <AvatarEditor
              ref={editorRef}
              image={image}
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
  </GenericModal>
  
  )
  
}

export default Editor