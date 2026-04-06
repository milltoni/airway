import React from "react";
//import { useSelector} from "react-redux";

import EditorField from "./editor_field/EditorField";
import HowToUse from "./howtouse_field/HowToUse";
import Editor from "./editor/Editor";

const EditorContainer = () => {
    return (
        <div>
            <HowToUse />;
            <div className="container">
                <div className="right">
                    <Editor />
                </div>
                <div className="left">
                    <EditorField />
                </div>
            </div>
        </div>
    );
}

export default EditorContainer;