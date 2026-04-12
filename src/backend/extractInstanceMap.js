import {
    getAllReferences,
    getInstanceMap,
    getReferencesFromNodes
  } from "./ast/DocModel";
  import parseYAML from "./parser/yaml_parser";
  import validateProjectSchema from "./validators/structure/structure_validator";
  
  const getZeroMatrix = dimensions => {
    let array = [];
    for (let i = 0; i < dimensions[0]; ++i) {
      array.push(
        dimensions.length === 1 ? 0 : getZeroMatrix(dimensions.slice(1))
      );
    }
    return array;
  };
  
  const getInstanceMatrix = (instanceMap, references) => {
    const numberOfInstances = Object.keys(instanceMap).length;
    let instanceMatrix = getZeroMatrix([numberOfInstances, numberOfInstances]);
    const getLanguageIndex = (instanceMap, name) => {
      return instanceMap[name].index;
    };
  
    let referralLanguageIndex;
    let referencedLanguageIndex;
  
    references.forEach(reference => {
      referralLanguageIndex = getLanguageIndex(
        instanceMap,
        reference.referral.join(".")
      );
      referencedLanguageIndex = getLanguageIndex(
        instanceMap,
        reference.value.join(".")
      );
  
      instanceMatrix[referralLanguageIndex][referencedLanguageIndex]++;
    });
  
    const anyReference = (i, instanceMatrix) => {
      return instanceMatrix[i].some(Boolean);
    };
    for (let i in instanceMatrix) {
      if (!anyReference(i, instanceMatrix)) {
        instanceMatrix[i][i] += 1;
      }
    }
  
    return instanceMatrix;
  };
  
  const extractInstanceMap = (yamlString, linkedBase, errors) => {
    
    if (errors.length) {
      return {}
    }

    let parsedYaml = parseYAML(yamlString);
    const dM = validateProjectSchema(parsedYaml.jsonObj, yamlString).docModel;
    const referenceNodes = getAllReferences(dM);
    const references = getReferencesFromNodes(
      dM,
      yamlString,
      referenceNodes,
      linkedBase
    );
    if (!references.length > 0) {
      return {};
    }
  
    const instanceMap = getInstanceMap(dM, linkedBase);
    const instanceMatrix = getInstanceMatrix(instanceMap, references);
    return {
      instanceMatrix,
      instanceMap,
    };
  };
  
  export default extractInstanceMap;