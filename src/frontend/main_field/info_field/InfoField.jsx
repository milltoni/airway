import { useSelector } from "react-redux";

import CloseButton from "./CloseButton";
import GeneralInfo from "./GeneralInfo";
import MutualInfo from "./MutualInfo";

import { getInfoInstances } from "../../../backend/getInfoInstances";

const InfoField = () => {
    const yamlString = useSelector((state) => (state.data.yamlString));
    const chosenInstances = useSelector((state) => (state.graph.chosenInstances));
    const hoveredInstances = useSelector((state) => (state.graph.hoveredInstances));

    const infoInstances = getInfoInstances(
        yamlString,
        chosenInstances.length ? chosenInstances : hoveredInstances
    );

    switch (infoInstances.length) {
        case 1:
            return (
                <div>
                    <CloseButton />
                    <GeneralInfo data={infoInstances[0]} />
                </div>
            );
        case 2:
            return (
                <div>
                    <CloseButton />
                    <MutualInfo infoInstances={infoInstances} />
                </div>
            );
        default:
            return <div />;
    }
};

export default InfoField;