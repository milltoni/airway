import { configureStore } from '@reduxjs/toolkit'
import modeReducer from './slices/modeSlice'
import popupReducer from './slices/popupSlice'

export default configureStore({
  reducer: {
    mode: modeReducer,
    popup: popupReducer,
  },
})