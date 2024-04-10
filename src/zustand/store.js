import {create} from 'zustand'

export const useStore = create( (set) => (
    {
        showUserOpt: "none",
        setShowUserOpt: () => set((state)=>{
                if(state.showUserOpt === "none"){
                    return { showUserOpt: "" }
                }
                if(state.showUserOpt === ""){
                    return { showUserOpt: "none"}  
                }
            }
        )
    }
))