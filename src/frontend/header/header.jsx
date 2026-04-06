import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { DisplayMode, EditorMode } from "../../store/slices/modeSlice";
import { isEditorMode } from "../../constants";
import { ShowPopup } from "../../store/slices/popupSlice"
import { ShowOrHideAddInfo } from "../../store/slices/add_infoSlice";
import { ResetToDefault, fetchYaml } from "../../store/slices/dataSlice";

import logo from "./logo.svg";
import "./header.css";

const Links = props => {
  const { links, action } = props;
  return (
    <div className="nav-lists">
      <ul className="nav-site nav-site-internal">
        {links.map((link, i) => <li key={i}>{link}</li>)}
      </ul>
      <ul className="nav-site nav-site-external">
        <li>
          {action}
        </li>
      </ul>
    </div>
  );
};
  
  const Header = () => {
    const mode = useSelector((state) => state.mode.mode);
    const add_info = useSelector((state) => state.add_info.isShown);
    const dispatch = useDispatch();

    const resetAndFetch = () => {
      dispatch(ResetToDefault());
      dispatch(fetchYaml());
    };

    const displayLinks = {
      links: [
        <a href="https://github.com/milltoni/airway.git">GitHub</a>,
        <a href="https://milltoni.github.io/airway/README.md">About Project</a>
      ],
      action: (
        <a href="#" onClick={() => dispatch(EditorMode())}>
          Editor mode
        </a>
      )
    };
  
    const editorLinks = {
      links: [
        <a href="https://github.com/milltoni/airway.git">GitHub</a>,
        <a href="#" onClick={() => dispatch(ShowOrHideAddInfo(add_info ? false : true))}>How to Use</a>,
        <a href="#" onClick={() => dispatch(ShowPopup)}>Create Pull Request</a>,
        <a href="#" onClick={() => resetAndFetch()}>Reset</a>
      ],
      action: (
        <a href="#" onClick={() => dispatch(DisplayMode())}>
          See as user
        </a>
      )
    };
  
    const headerLinks = isEditorMode(mode) ? editorLinks : displayLinks;
  
    return (
      <div className="nav-main">
        <div className="wrap">
          <a className="nav-home" href="https://milltoni.github.io/airway">
            <img
              className="nav-logo"
              alt="airway"
              src={logo}
              width="36"
              height="36"
            />
            airway
          </a>
          <Links links={headerLinks.links} action={headerLinks.action} />
        </div>
      </div>
    );
  };
  
  export default Header;