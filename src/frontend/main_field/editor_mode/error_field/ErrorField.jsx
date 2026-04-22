import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setLineToGoTo } from "../../../../store/slices/dataSlice";

import Error from "./Error";

import "./ErrorField.css";

const sortedByLine = (errors) => {
  return [...errors].sort((e1, e2) => e1.line - e2.line);
};

const ErrorField = () => {
  const errors = useSelector((state) => state.data.errors);
  const dispatch = useDispatch();

  const sortedErrors = useMemo(() => sortedByLine(errors), [errors]);

  useEffect(() => {
    if (window.editor) {
      window.editor.resize();
    }
  }, [sortedErrors.length]);

  if (!sortedErrors.length) {
    return null;
  }

  return (
    <div>
      <div className="errors__header">Errors</div>
      <div className="errors_container">
        {sortedErrors.map((err, index) => (
          <Error
            key={err.id || index}
            line={err.line}
            message={err.message}
            scope={err.scope}
            onClick={(line) => dispatch(setLineToGoTo(line))}
          />
        ))}
      </div>
    </div>
  );
};

export default ErrorField;