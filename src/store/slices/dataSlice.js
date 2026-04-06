import { createSlice } from '@reduxjs/toolkit'

import { getYaml } from "../../backend/getYAML";
//import { extractInstanceMap } from "../../backend/extractInstanceMap"
//import { validateYamlString } from "../../backend/validateYamlString"

export const dataSlice = createSlice({
    name: 'data',
    initialState: {
        yamlString: "",
        instanceMatrix: null,
        instanceMap: null,
        errors: []
    },
    reducers: {
        ResetToDefault: (state) => {
            state.yamlString = "";
            state.instanceMap = null;
            state.instanceMatrix = null;
            state.errors = []
        },
        fetchYaml: (state) => {state.yamlString = getYaml()},
        /*ExtractInstanceMap: (state) => {
            const linkedBase = "/#/definitions/language";
            const {newInstanceMatrix, newInstanceMap} = extractInstanceMap(state.yamlString, linkedBase, state.errors)
            state.instanceMatrix = newInstanceMatrix;
            state.instanceMap = newInstanceMap;
        },*/
        //validate: (state) => {state.errors = validateYamlString(state.yamlString)},
    }
})

export const {ResetToDefault, fetchYaml} = dataSlice.actions
export default dataSlice.reducer