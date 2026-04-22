import React, { useState, useCallback, useEffect, useRef } from "react";
import AceEditor from "react-ace";
import { useSelector, useDispatch } from "react-redux";
import debounce from "lodash/debounce";

import { Validate, ExtractInstanceMap, setValue, fetchYaml } from "../../../../store/slices/dataSlice";

import "brace/mode/yaml";
import "brace/theme/tomorrow_night_eighties";
import "brace/ext/language_tools";
import "brace/ext/searchbox";

import "./Editor.css";

const Editor = () => {
  const yamlString = useSelector((state) => state.data.yamlString);
  const errors = useSelector((state) => state.data.errors);
  const dispatch = useDispatch();

  const [editorInstance, setEditorInstance] = useState(null);

  const rebuild = useCallback(() => {
    dispatch(Validate());
    dispatch(ExtractInstanceMap());
  }, [dispatch]);

  const debouncedRebuild = useRef(
    debounce(() => rebuild(), 300)
  ).current;

  const onChange = useCallback(
    (value) => {
      dispatch(setValue(value));
      debouncedRebuild();
    },
    [dispatch, debouncedRebuild]
  );

  const onLoad = useCallback(
    (editor) => {
      window.editor = editor;
      setEditorInstance(editor);

      const session = editor.getSession();
      const value = editor.getValue();

      onChange(value);
      rebuild();

      session.off("change", editor.renderer.$gutterLayer.$updateAnnotations);
      editor.commands.on("afterExec", (e) => {
        if (e.command.name === "insertstring" && e.args === ".") {
          e.editor.execCommand("startAutocomplete");
        }
      });
    },
    [onChange, rebuild]
  );

  useEffect(() => {
    if (!yamlString) {
      dispatch(fetchYaml());
    }
  }, [dispatch, yamlString]);

  const updateErrorAnnotations = useCallback((editor, errorList) => {
    if (!editor) return;
    const annotations = errorList.map((err) => ({
      row: err.line - 1,
      column: 0,
      text: err.message,
      type: "error",
    }));
    editor.getSession().setAnnotations(annotations);
  }, []);

  useEffect(() => {
    if (editorInstance && errors) {
      updateErrorAnnotations(editorInstance, errors);
    }
  }, [errors, editorInstance, updateErrorAnnotations]);

  useEffect(() => {
    return () => debouncedRebuild.cancel();
  }, [debouncedRebuild]);

  return (
    <AceEditor
      width="100%"
      height="100%"
      value={yamlString}
      mode="yaml"
      theme="tomorrow_night_eighties"
      onLoad={onLoad}
      onChange={onChange}
      tabSize={2}
      fontSize={14}
      useSoftTabs={true}
      wrapEnabled={true}
      editorProps={{
        display_indent_guides: true,
        folding: "markbeginandend",
        $useWorker: false,
      }}
      setOptions={{
        fontFamily: "Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif",
        cursorStyle: "smooth",
        enableMultiselect: false,
      }}
    />
  );
};

export default Editor;