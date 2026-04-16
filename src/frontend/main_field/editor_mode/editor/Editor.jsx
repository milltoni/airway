import React from "react";
import AceEditor from "react-ace";
import { useSelector, useDispatch } from "react-redux";

/*import editorPluginsHook from "../../build/editor-plugins/completers/completers-helpers/hook";
import { onCtrlMouseDown } from "../../build/editor-plugins/commands/ctrl-click";
import { onCtrl } from "../../build/editor-plugins/commands/ctrl"; */

import { Validate, ExtractInstanceMap, setValue, fetchYaml } from "../../../../store/slices/dataSlice";

import "brace/mode/yaml";
import "brace/theme/tomorrow_night_eighties";
import "brace/ext/language_tools";
import "brace/ext/searchbox";

//import isEqual from "lodash/isEqual";

import "./Editor.css";

const Editor = () => {
    const yamlString = useSelector((state) => state.data.yamlString);
    const errors = useSelector((state) => state.data.errors);
    const dispatch = useDispatch();

    const [editor] = React.useState(null);

    const rebuild = () => {
        dispatch(Validate());
        dispatch(ExtractInstanceMap());
    };

    const onChange = (value) => {
        dispatch(setValue(value));
    };

    const onLoad = (editor) => {
        window.editor = editor;

        let session = editor.getSession();
        const value = editor.getValue();

        onChange(value);
        rebuild();

        //Disable automatic error-marker correction by ace
        session.off("change", editor.renderer.$gutterLayer.$updateAnnotations);

        //After dot completion
        editor.commands.on("afterExec", function (e, t) {
            if (e.command.name === "insertstring" && e.args === ".") {
                e.editor.execCommand("startAutocomplete");
            }
        });

        //Handle ctrl+click
        /* editor.on("mousedown", onCtrlMouseDown);
         //Highlight references on ctrl
         editor.on("mousemove", onCtrl);
         editor.$blockScrolling = Infinity;
         editorPluginsHook(editor, null, null || ["autosuggestApis"]);
     
         this.updateErrorAnnotations(this.props, editor);*/
    };


    /*updateErrorAnnotations = (nextProps, editor) => {
        if (!editor) {
            editor = state.editor;
        }
        if (editor && nextProps.errors) {
            const editorAnnotations = nextProps.errors.map(err => {
                // Create annotation objects that ACE can use
                return {
                    row: err.line - 1,
                    column: 0,
                    text: err.message,
                    type: "error"
                };
            });
            editor.getSession().setAnnotations(editorAnnotations);
        }
    };*/

    React.useEffect(() => {

        if (!yamlString) {
            fetchYaml();
        }

    }, []);

    return (
        <AceEditor
            width="100%"
            height="100%"
            value={yamlString}
            mode="yaml"
            theme="tomorrow_night_eighties"
            onLoad={onLoad.bind(editor)}
            onChange={onChange.bind(yamlString)}
            tabSize={2}
            fontSize={14}
            useSoftTabs="true"
            wrapEnabled={true}
            editorProps={{
                display_indent_guides: true,
                folding: "markbeginandend",
                $useWorker: false
            }}
            setOptions={{
                fontFamily: "Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif",
                cursorStyle: "smooth",
                enableMultiselect: false
            }}
        />
    );
}

export default Editor;