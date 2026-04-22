import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { isEditorMode } from "../../constants";
import { DisplayMode, EditorMode } from "../../store/slices/modeSlice";
import { ShowOrHideAddInfo } from "../../store/slices/add_infoSlice";
import { ShowOrHidePRform } from "../../store/slices/pullrequestSlice";
import { ResetToDefault, fetchYaml, ExtractInstanceMap, Validate } from "../../store/slices/dataSlice";
import { ShowOrHideAboutProject } from "../../store/slices/about_projectSlice";

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
  const prf = useSelector((state) => state.pullRequestForm.isShown);
  const ap = useSelector((state) => state.about_project.isShown);
  //const data = useSelector((state) => state.data.yamlString);
  const dispatch = useDispatch();

  const resetAndFetch = () => {
    dispatch(ResetToDefault());
    dispatch(fetchYaml());
    dispatch(Validate());
    dispatch(ExtractInstanceMap());
  };

  const displayLinks = {
    links: [
      <a href="https://github.com/milltoni/airway.git">GitHub</a>,
      <a href="#" onClick={() => dispatch(ShowOrHideAboutProject(ap ? false : true))}>About Project</a>
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
      <a href="#" onClick={() => dispatch(ShowOrHidePRform(prf ? false : true))}>Create Pull Request</a>,
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