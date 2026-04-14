import React from "react";

const Vertices = ({
    displayData,
    outerRadius,
    getArc,
    getFill,
    getStroke,
    instancePathByIndex,
    onMouseOverVertex,
    onMouseOutVertex,
    onClickVertex,
    chosenInstancesIndices,
}) => {
    return (
        <g>
            {displayData.groups.map((group, i) => {
                const angle = (group.startAngle + group.endAngle) / 2;
                const isRotationNeeded = angle > Math.PI;

                return (
                    <g key={i}>
                        <g key={i}>
                            <path
                                d={getArc(group)}
                                fill={getFill(i)}
                                stroke={getStroke(i, chosenInstancesIndices)}
                                strokeWidth={2}
                                onMouseOver={() => onMouseOverVertex(i)}
                                onMouseOut={() => onMouseOutVertex(i)}
                                onClick={() => onClickVertex(i)}
                            />
                        </g>
                        <text
                            transform={
                                "rotate(" +
                                (angle * 180 / Math.PI - 90) +
                                ")" +
                                "translate(" +
                                (outerRadius + 3) +
                                ")" +
                                (isRotationNeeded ? "rotate(180)" : "")
                            }
                            dy=".35em"
                            textAnchor={isRotationNeeded ? "end" : ""}
                            fontSize="10px"
                            onMouseOver={() => onMouseOverVertex(i)}
                            onMouseOut={() => onMouseOutVertex(i)}
                            onClick={() => onClickVertex(i)}
                        >
                            {instancePathByIndex(i)}
                        </text>
                    </g>
                );
            })}
        </g>
    );
}

export default Vertices;