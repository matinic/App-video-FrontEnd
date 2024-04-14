import {create} from 'zustand'

export const useStore = create( (set) => (
    {
        pointerEvent: "",
        setPointerEvent: () => set((state)=>{
                if(state.pointerEvent === "none"){
                    return { pointerEvent: "" }
                }
                if(state.pointerEvent === ""){
                    return {pointerEvent: "none"}  
                }
            }
        )
    }
))