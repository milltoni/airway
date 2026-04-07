import { getAllReferences } from "./ast/DocModel"; //+
import { validateReferences } from "./validators/semantic/semantic_validator"; //+
import parseYAML from "./parser/yaml_parser"; //+
import validateProjectSchema from "./validators/structure/structure_validator"; //+

import memoize from "lodash/memoize";

export const validateYamlString = (yamlString, validateSchema) => {
  let parsedYaml = parseYAML(yamlString);
  if (parsedYaml.error) {
    return {
      errors: [parsedYaml.error]
    };
  }
  let jsonObj = parsedYaml.jsonObj;

  // Structural validation
  let validatedSchema = validateSchema(jsonObj, yamlString);
  let dM = validatedSchema.docModel;

  // Semantic validation
  const referenceNodes = getAllReferences(dM);
  const v = validateReferences(dM, yamlString, referenceNodes);

  return {
    errors: [...v.errors, ...validatedSchema.errors]
  };
};

let cachedValidateYamlString = memoize(yamlString =>
  validateYamlString(yamlString, validateProjectSchema)
);

export default cachedValidateYamlString;