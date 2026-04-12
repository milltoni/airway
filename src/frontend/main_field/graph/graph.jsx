import React from "react";
import * as d3 from "d3";
import { useSelector } from "react-redux";

import Lines from "./Lines";
import Vertices from "./Vertices";

import "./graph.css"

const graph = () => {
    const instanceMatrix = useSelector(state.data.instanceMatrix);
    const instanceMap = useSelector(state.data.instanceMap);

    if (!instanceMap) {
        return null;
      }

    const width = 928;
    const height = 680;

    const color = d3.scaleOrdinal(d3.schemeCategory10);


    return (
        <div className="aligner">
            <svg
            width={"100%"}
            height={size}
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            >
                <g id="circle" /*transform={`translate(${moveToCenter},0)`}*/>
                    <g className="groups">
                        <Vertices />
                    </g>
                    <g className="ribons">
                        <Lines />
                    </g>
                </g>
            </svg>
        </div>
    );
}

export default graph;