import React from 'react'

export default function Section(props) {
  return (
    <div>
        {
            props?.array?.map(el =>{
                return el
            })
        }
    </div>
  )
}
