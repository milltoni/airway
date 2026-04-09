import { configureStore } from '@reduxjs/toolkit'
import modeReducer from './slices/modeSlice'
import add_infoReducer from './slices/add_infoSlice'
import dataReducer from './slices/dataSlice'
import pullrequestReducer from './slices/pullrequestSlice'

export default configureStore({
  reducer: {
    mode: modeReducer,
    add_info: add_infoReducer,
    data: dataReducer,
    PullRequestForm: pullrequestReducer
  },
})