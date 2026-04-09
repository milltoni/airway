import React from "react";
//import { useSelector} from "react-redux";

import EditorField from "./editor_field/EditorField";
import HowToUse from "./howtouse_field/HowToUse";
import Editor from "./editor/Editor";
import PullRequestForm from "../../PullRequest_form/pr_form";

const EditorContainer = () => {
    return (
        <div>
            <HowToUse />;
            <PullRequestForm />
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