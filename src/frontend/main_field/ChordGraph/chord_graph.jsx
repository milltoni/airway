import React from "react";
import * as d3 from "d3";
import { useDispatch, useSelector } from "react-redux";

import { chooseInstances, hoverInstances } from "../../../store/slices/graphSlice";
import { isEditorMode } from "../../../constants";

import Lines from "./Lines";
import Vertices from "./Vertices";

import "./chord_graph.css";

const ChordGraph = () => {
    const dispatch = useDispatch();
    const instanceMatrix = useSelector((state) => (state.data.instanceMatrix));
    const instanceMap = useSelector((state) => (state.data.instanceMap));
    const chosenInstances = useSelector((state) => (state.graph.chosenInstances));
    const hoveredInstances = useSelector((state) => (state.graph.hoveredInstances));
    const mode = useSelector((state) => (state.mode.mode));

   const instancePathByIndex = (index) => {
        return getInstancePathByIndex(index, instanceMap);
    }

    const getInstancePathByIndex = (index, instanceMap) => {
        const keys = Object.keys(instanceMap);
        for (let i = 0; i < keys.length; i++) {
            if (instanceMap[keys[i]].index === index) {
                return instanceMap[keys[i]].name;
            }
        }
    }

    const instanceIndicesByPaths = (paths) => {
        return paths.filter(path => instanceMap[path]).map(path => {
            return instanceMap[path].index;
        });
    }

    const ChooseInstances = (instanceIndices) => {
        dispatch(chooseInstances([
            instancePathByIndex(instanceIndices[0]),
            instancePathByIndex(instanceIndices[1])
        ]));
    }

    const HoverInstances = (instanceIndices) => {
        dispatch(hoverInstances([
            instancePathByIndex(instanceIndices[0]),
            instancePathByIndex(instanceIndices[1])
        ]));
    }

    if (!instanceMap) {
        return null;
    }

    let size;

    isEditorMode(mode) ? size = 450 : size = 650;
    

    const width = size, height = size;

    const outerRadius = Math.min(width, height) * 0.5 - 40;
    const innerRadius = outerRadius - 20;

    const chord = d3.chord().padAngle(0.05).sortSubgroups(d3.descending);
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
    const ribbon = d3.ribbon().radius(innerRadius);

    const displayData = chord(instanceMatrix);
    const chosen = instanceIndicesByPaths(
        chosenInstances.filter(Boolean).length
            ? chosenInstances
            : hoveredInstances
    );

    const moveToCenter = window.innerWidth / 4 - size / 1.8;

    return (
        <div className="aligner">
            <svg
                width={"100%"}
                height={size+60}
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
            >
                <g id="circle" transform={`translate(${moveToCenter},0)`}>
                    <g transform={`translate(${size / 1.8}, ${size / 1.8})`}>
                        <g className="groups">
                            <Vertices
                                displayData={displayData}
                                outerRadius={outerRadius}
                                getArc={arc}
                                getFill={i => color(i)}
                                getStroke={(i, chosen) => {
                                    if (chosen && !chosen.includes(i)) {
                                        return d3.rgb(color(i)).darker();
                                    }
                                    return d3.rgb("#0159ff");
                                }}
                                instancePathByIndex={i =>
                                    getInstancePathByIndex(i, instanceMap)}
                                onMouseOverVertex={i => HoverInstances([i])}
                                onMouseOutVertex={() => HoverInstances([])}
                                onClickVertex={i => ChooseInstances([i])}
                                chosenInstancesIndices={chosen}
                            />
                        </g>
                        <g className="ribbons">
                            <Lines
                                displayData={displayData}
                                getRibbon={ribbon}
                                getFill={edge => color(edge.target.index)}
                                getStroke={(edge, chosen) => {
                                    if (
                                        chosen &&
                                        !chosen.includes(edge.source.index) &&
                                        !chosen.includes(edge.target.index)
                                    ) {
                                        return d3.rgb(color(edge.target.index)).darker();
                                    }
                                    return d3.rgb("#0159ff");
                                }}
                                onMouseOver={edge =>
                                    HoverInstances([edge.source.index, edge.target.index])}
                                onMouseOut={() => HoverInstances([])}
                                onClickEdge={edge =>
                                    ChooseInstances([
                                        edge.source.index,
                                        edge.target.index
                                    ])}
                                chosenInstancesIndices={chosen}
                            />
                        </g>
                    </g>
                </g>
            </svg>
        </div>
    );
}

export default ChordGraph;