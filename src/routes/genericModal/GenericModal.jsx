import React from 'react'
import { Modal, Box } from '@mui/material'

export default function GenericModal({children,onClose,open,...moreStyles}) {

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: '#262626',
        boxShadow: 24,
        borderRadius: 2,
        width: 400,
        pt: 2,
        px: 4,
        pb: 3,
    };

  return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{ ...style }}
                {...moreStyles}
            >
                {children}
            </Box>
        </Modal>
  )
}

