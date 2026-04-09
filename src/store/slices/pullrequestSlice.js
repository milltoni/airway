import { createSlice } from '@reduxjs/toolkit'

export const pullrequestSlice = createSlice({
    name: 'PullRequestForm',
    initialState: {
        isShown: false
    },
    reducers: {
        ShowOrHidePRform: (state, action) => {state.isShown = action.payload},
    }
})

export const {ShowOrHidePRform} = pullrequestSlice.actions
export default pullrequestSlice.reducer