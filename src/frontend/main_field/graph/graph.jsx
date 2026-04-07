import React from "react";
import * as d3 from "d3";
import { useSelector } from "react-redux";

import Lines from "./Lines";
import Vertices from "./Vertices";

import "./graph.css"

const graph = () => {
    const instanceMatrix = useSelector(state.data.instanceMatrix);
    const instanceMap = useSelector(state.data.instanceMap);
    return (
        <div className="aligner">
            <svg
            width={"100%"}
            height={size}
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            >
                <g className="groups">
                    <Vertices />
                </g>
                <g className="ribons">
                    <Lines />
                </g>
            </svg>
        </div>
    );
}

export default graph;