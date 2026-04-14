import React from "react";

const Lines = ({
    displayData,
    getRibbon,
    getFill,
    getStroke,
    onMouseOver,
    onMouseOut,
    onClickEdge,
    chosenInstancesIndices
}) => {
    const shouldBeDisplayed = vertex => {
        const chosenIds = chosenInstancesIndices;
        return !//1 chosen => only its vertexes should be displayed
            ((chosenIds.length === 1 &&
                !(chosenIds.includes(vertex.target.index) ||
                    chosenIds.includes(vertex.source.index))) ||
                //2 chose => their common vertex should by displayed only
                (chosenIds.length === 2 &&
                    !(chosenIds.includes(vertex.target.index) &&
                        chosenIds.includes(vertex.source.index))));
    };

    return (
        <g>
            {displayData.map((edge, i) => {
                if (!shouldBeDisplayed(edge)) {
                    return <g key={i} />;
                }

                return (
                    <g key={i}>
                        <path
                            d={getRibbon(edge)}
                            fill={getFill(edge)}
                            strokeWidth="1"
                            stroke={getStroke(edge, chosenInstancesIndices)}
                            onMouseOver={() => onMouseOver(edge)}
                            onMouseOut={() => onMouseOut(edge)}
                            onClick={() => onClickEdge(edge)}
                        />
                    </g>
                );
            })}
        </g>
    );
}

export default Lines;