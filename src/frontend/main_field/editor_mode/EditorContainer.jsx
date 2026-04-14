import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Validate, ExtractInstanceMap } from "../../../store/slices/dataSlice"

import ChordGraph from "../ChordGraph/chord_graph";
import HowToUse from "./howtouse_field/HowToUse";
import Editor from "./editor/Editor";
import PullRequestForm from "./PullRequest_form/pr_form";
import EditorField from "./editor_field/EditorField";

import "./EditorContainer.css"

const EditorContainer = () => {
    const dispatch = useDispatch();
    const im = useSelector((state) => (state.data.instanceMap));
    return (
        <div>
            <HowToUse />;
            <PullRequestForm />
            <div className="container">
                <div className="right">
                    <ChordGraph />
                </div>
                <div className="left">
                    <Editor />
                </div>
            </div>
        </div>
    );
}

export default EditorContainer;