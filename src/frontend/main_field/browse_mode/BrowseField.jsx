import React from "react";
//import { useDispatch, useSelector } from "react-redux";

//import ForceGraph from "../ForceGraph/ForceGraph";
import ChordGraph from "../ChordGraph/chord_graph";
import EditorField from "../editor_mode/editor_field/EditorField";

import "./BrowseField.css"

//import { setGraphData } from "../../../store/slices/graphSlice";

const BrowseField = () => {
  //const dispatch = useDispatch();
  //const graphData = useSelector((state) => state.data.instanceMap);
  return (
    <div className="container1">
      <div className="left1">
        <ChordGraph />
      </div>
      <div className="left2">
      </div>
    </div>
  );
}

export default BrowseField;