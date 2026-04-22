import { configureStore } from '@reduxjs/toolkit'

import modeReducer from './slices/modeSlice'
import add_infoReducer from './slices/add_infoSlice'
import dataReducer from './slices/dataSlice'
import pullRequestReducer from './slices/pullrequestSlice'
import graphReducer from './slices/graphSlice'
import about_projectReducer from './slices/about_projectSlice'

export default configureStore({
  reducer: {
    mode: modeReducer,
    add_info: add_infoReducer,
    data: dataReducer,
    pullRequestForm: pullRequestReducer,
    graph: graphReducer,
    about_project: about_projectReducer
  },
})