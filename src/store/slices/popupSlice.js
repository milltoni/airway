import { createSlice } from '@reduxjs/toolkit'

export const popupSlice = createSlice({
    name: 'popup',
    initialState: {
        isShown: false
    },
    reducers: {
        ShowPopup: (state) => {state.isShown = true},
        HidePopup: (state) => {state.isShown = false},
    }
})

export const {ShowPopup, HidePopup} = popupSlice.actions
export default popupSlice.reducer