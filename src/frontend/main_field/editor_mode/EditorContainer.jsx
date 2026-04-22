import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Validate, ExtractInstanceMap } from "../../../store/slices/dataSlice"

import ChordGraph from "../ChordGraph/chord_graph";
import HowToUse from "./howtouse_field/HowToUse";
import Editor from "./editor/Editor";
import PullRequestForm from "./PullRequest_form/pr_form";
import InfoField from "../info_field/InfoField";
import ErrorField from "./error_field/ErrorField";

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
                    <InfoField />
                </div>
                <div className="left">
                    <Editor />
                    <ErrorField />
                </div>
            </div>
        </div>
    );
}

export default EditorContainer;