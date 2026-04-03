import { createSlice } from '@reduxjs/toolkit'
import { BROWSE_MODE, EDITOR_MODE } from '../../constants'

export const modeSlice = createSlice({
    name: 'mode',
    initialState: {
        mode: BROWSE_MODE
    },
    reducers: {
        DisplayMode: (state) => {state.mode = BROWSE_MODE},
        EditorMode: (state) => {state.mode = EDITOR_MODE},
    }
})

export const {DisplayMode, EditorMode} = modeSlice.actions
export default modeSlice.reducer