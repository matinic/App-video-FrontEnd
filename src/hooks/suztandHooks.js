import { create } from "zustand"

const useSnackBar = create(set =>{
    return {
        open: false,
        message: "",
        setOpen: (message) => set(state => ({...state, open: true, message })),
        setClose: () => set(state => ({...state, open: false})),
    }
})

export {
    useSnackBar
}