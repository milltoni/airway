import React from 'react';

import InfoWidget from "./InfoBody";

import "./InfoBody.css";
import {
    getIsContainerKey,
    isNestedInfoWidget,
    makeBasePretty,
    makeKeyPretty,
    isArrayNode
} from "./mini_func";

const GeneralInfo = (props) => {

    const { data, isContainerKey } = props;

    const [collapsed, setCollapsed] = React.useState(() => {
        const initialCollapsed = {};
        const source = data?.value ?? {};
        Object.keys(source).forEach(key => {
            initialCollapsed[key] = true;
        });
        return initialCollapsed;
    });


    const toggleCollapsedKey = (key) => {
        setCollapsed(prev =>({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleClick = key => {
        toggleCollapsedKey(key);
    };

    if (!data) {
        return <div />;
    }

    const base = isContainerKey ? null : makeBasePretty(data.base);
    const nestedNodeClass = isContainerKey ? null : "nested_info_widget";

    const body = (
        <div>
            {" "}{Object.keys(data.value).map(key => {
                const node = data.value[key];
                const prettyKey = makeKeyPretty(key);
                if (!isNestedInfoWidget(node)) {
                    if (isArrayNode(node)) {
                        return (
                            <div key={key}>
                                <div className="info_widget__key">{prettyKey}</div>
                                <div className="info_widget__value">
                                    <ul className="info_widget_list">
                                        {node.value.map((item, i) => (
                                            <li key={i}>{item.value}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    }

                    let value = typeof node === "object" ? node.value : node;
                    value = value.toString() || "No info yet."

                    return (
                        <div key={key}>
                            <div className="info_widget__key">{prettyKey}</div>
                            <span className="info_widget__value">{value}</span>
                        </div>
                    );
                }
                const nestedNodes = (
                    <div className={nestedNodeClass}>
                        <GeneralInfo
                            data={node}
                            isContainerKey={getIsContainerKey(node, key)}
                        />
                    </div>
                );
                const isCollapsed = collapsed[key];

                return (
                    <div key={key}>
                        <div
                            onClick={() => handleClick(key)}
                            className="info_widget__key info_widget__toggable_key"
                        >
                            <span>
                                {isCollapsed ? "[+]  " : " [-]  "}
                            </span>
                            {prettyKey}
                        </div>
                        {isCollapsed ? null : nestedNodes}
                    </div>
                );
            })}
        </div>
    );

    return <InfoWidget base={base} body={body} />;

}

export default GeneralInfo;