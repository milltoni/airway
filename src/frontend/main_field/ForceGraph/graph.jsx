import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ForceGraph from "./ForceGraph";
import "./graph.css"

function graph() {
  const dispatch = useDispatch();
  const graphData = useSelector((state) => state.data.instanceMap);

  return (
    <div className="graph">
      {graphData && <ForceGraph graphData={graphData} />}
    </div>
  );
}

export default graph;