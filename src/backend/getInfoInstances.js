import { getDmNodeByPath } from "./ast/DocModel";
import parseYAML from "./parser/yaml_parser";
import validateSchema from "./validators/structure/structure_validator";
import { pathToArray } from "./PathToArray";

export const getInfoInstances = (yamlString, paths) => {
  if (!paths) {
    return [];
  }

  let parsedYaml = parseYAML(yamlString);

  if (parsedYaml.error) {
    return [];
  }

  const v = validateSchema(parsedYaml.jsonObj, yamlString);

  if (v.errors.length) {
    return [];
  }

  return paths.filter(Boolean).map(pathString => {
    return {
      ...getDmNodeByPath(v.docModel, pathToArray(pathString)),
      pathString
    };
  });
};