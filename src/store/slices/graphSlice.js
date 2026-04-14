import { createSlice } from "@reduxjs/toolkit";

const graphSlice = createSlice({
  name: "graph",
  initialState: {
    chosenInstances: [],
    hoveredInstances: []
  },
  reducers: {
    chooseInstances: (state, action) => {
      state.chosenInstances = action.payload.filter(Boolean);
    },
    hoverInstances: (state, action) => {
      state.hoveredInstances = action.payload.filter(Boolean);
    }
  },
});

export const { chooseInstances, hoverInstances} = graphSlice.actions;
export default graphSlice.reducer;
