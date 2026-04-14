import { getAllReferences } from "./ast/DocModel"; //+
import { validateReferences } from "./validators/semantic/semantic_validator"; //+
import parseYAML from "./parser/yaml_parser"; //+
import validateProjectSchema from "./validators/structure/structure_validator"; //+

import memoize from "lodash/memoize";

export const validateYaml = (yamlString, validateSchema) => {
  let parsedYaml = parseYAML(yamlString);
  if (parsedYaml.error) {
    return {
      errors: [parsedYaml.error]
    };
  }
  let jsonObj = parsedYaml.jsonObj;
  // Structural validation
  const validatedSchema = validateSchema(jsonObj, yamlString);
  let dM = validatedSchema.docModel;
  // Semantic validation
  const referenceNodes = getAllReferences(dM);
  const v = validateReferences(dM, yamlString, referenceNodes);
  //console.log(v);
  return {
    errors: [...v.errors, ...validatedSchema.errors]
  };
};

let ValidateYamlString = memoize(yamlString =>
  validateYaml(yamlString, validateProjectSchema)
);

export default ValidateYamlString;