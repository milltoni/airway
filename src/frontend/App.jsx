import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { fetchYaml } from "../store/slices/dataSlice";

import Header from "./header/header";
import BrowseField from "./main_field/browse_mode/BrowseField";
import EditorContainer from "./main_field/editor_mode/EditorContainer";

import { isEditorMode } from "../constants";

import "./App.css"

const App = () => {
    const mode = useSelector((state) => state.mode.mode);
    const dispatch = useDispatch();
    
    React.useEffect(() => {
        dispatch(fetchYaml());
        //dispatch();
    }, []);
    return (
        <div>
            <Header />
            {isEditorMode(mode) ? <EditorContainer /> : <BrowseField />}
        </div>
    );
}

export default App;