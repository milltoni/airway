import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { forkAndCommit } from '../../backend/github/GitHubPush';

export const submitPullRequest = createAsyncThunk(
    'pullRequest/submit',
    async ({ credentials, yamlString, prOptions }, { rejectWithValue }) => {
        try {
            const result = await forkAndCommit(credentials, yamlString, prOptions);
            return result;
        } catch (error) {
            return rejectWithValue(error.message || 'Unknown error');
        }
    }
);

const initialState = {
    isShown: false,
    isLoading: false,
    pushResult: null,   
    prResult: null,     
    prData: null,       
    error: null,
};

const pullRequestSlice = createSlice({
    name: 'pullRequestForm',
    initialState,
    reducers: {
        ShowOrHidePRform: (state, action) => {state.isShown = action.payload},
        resetStatus: (state) => {
            state.pushResult = null;
            state.prResult = null;
            state.error = null;
            state.prData = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitPullRequest.pending, (state) => {
                state.isLoading = true;
                state.pushResult = null;
                state.prResult = null;
                state.error = null;
                state.prData = null;
            })
            .addCase(submitPullRequest.fulfilled, (state, action) => {
                state.isLoading = false;
                state.pushResult = action.payload.commited ? 'Successful' : 'Failed';
                state.prResult = 'Successful';
                state.prData = action.payload.pr;
            })
            .addCase(submitPullRequest.rejected, (state, action) => {
                state.isLoading = false;
                state.pushResult = 'Failed';
                state.prResult = 'Failed';
                state.error = action.payload || 'Request failed';
            });
    },
});

export const { resetStatus, ShowOrHidePRform } = pullRequestSlice.actions;
export default pullRequestSlice.reducer;