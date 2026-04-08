import { createSlice } from '@reduxjs/toolkit'

import { getYaml } from "../../backend/getYAML";
import extractInstanceMap from "../../backend/extractInstanceMap";
import validateYamlString from "../../backend/validateYaml";

export const dataSlice = createSlice({
    name: 'data',
    initialState: {
        yamlString: "",
        instanceMatrix: null,
        instanceMap: null,
        errors: [],
    },
    reducers: {
        ResetToDefault: (state) => {
            state.yamlString = "";
            state.instanceMap = null;
            state.instanceMatrix = null;
            state.errors = []
        },
        fetchYaml: (state) => {state.yamlString = getYaml()},
        ExtractInstanceMap: (state) => {
            const linkedBase = "#/$defs/language";
            const dm = extractInstanceMap(state.yamlString, linkedBase, state.errors);
            state.instanceMatrix = dm.instanceMatrix;
            state.instanceMap = dm.instanceMap;
        },
        Validate: (state) => {state.errors = validateYamlString(state.yamlString)},
        setValue: (state, action) => {state.yamlString = action.payload},
    }
})

export const {ResetToDefault, fetchYaml, ExtractInstanceMap, Validate, setValue} = dataSlice.actions
export default dataSlice.reducer