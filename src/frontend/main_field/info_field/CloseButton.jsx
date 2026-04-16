import { useDispatch } from "react-redux";

import { chooseInstances } from "../../../store/slices/graphSlice";

import "./CloseButton.css";

const CloseButton = () => {
  const dispatch = useDispatch();

  return (
    <div>
      <a href="#" className="close-button" onClick={() => dispatch(chooseInstances([]))}>x</a>
    </div>
  );
};

export default CloseButton;