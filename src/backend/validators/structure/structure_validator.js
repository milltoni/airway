import Ajv from "ajv";
import { getLineForPath } from "../../ast/ast";
import { pathToArray } from "../../PathToArray";
import projectSchema from "./schema";

const ajv = new Ajv({
  allErrors: true,        
  verbose: true,          
  strict: false           
});

const processDataWithPaths = (data, schemaPath = "/") => {
  if (data === null || typeof data !== "object") {
    if (schemaPath.includes("/#/$defs/references/anyReference")) {
      return {value: data, base: "/#/defs/references/singleAnyReference"};
    }
    if (schemaPath.includes("/#/$defs/feature/inspired_by") || schemaPath.includes("/#/$defs/feature/predated_by") || schemaPath.includes("/#/$defs/feature/justified_by")){
      return {value: data, base: "/#/$defs/references/anyReference"};
    }
    return { value: data, base: "/" };
  }

  if (schemaPath.includes("/#/$defs/language/influenced") || schemaPath.includes("/#/$defs/language/influenced_by")) {
    schemaPath = "/#/$defs/references/anyReference";
  }

  if (schemaPath.includes("/#/$defs/features")) {
    schemaPath = "/#/$defs/feature";
  }

  if (schemaPath.includes("/#/$defs/language/features")) {
    schemaPath = "/#/$defs/features";
  }

  if (Array.isArray(data)) {
    const wrappedArray = data.map((item, index) => 
      processDataWithPaths(item, `${schemaPath}/${index}`)
    );
    return { value: wrappedArray, base: schemaPath };
  }
  
  const result = {};

  if (schemaPath.includes("//")){
    schemaPath = "/#/$defs/language";
  }

  for (const [key, value] of Object.entries(data)) {
    result[key] = processDataWithPaths(value, `${schemaPath}/${key}`);
  }
  return { value: result, base: schemaPath };
};

const validateCustomSchema = (jsonObj, yamlString, schema) => {
  let validate;
  try {
    validate = ajv.compile(schema);
  } catch (error) {
    console.log(error.message);
    return {
      docModel: jsonObj,
      errors: [{
        line: null,
        message: `Invalid schema: ${error.message}`,
        scope: "schema"
      }]
    };
  }
  const valid = validate(jsonObj);
  
  const wrappedData = processDataWithPaths(jsonObj);
  
  const docModel = wrappedData;
  
  let errors = [];
  
  if (!valid && validate.errors) {
    errors = validate.errors.map(err => {
      let path = err.instancePath || "";
      path = path.replace(/^\//, "").replace(/\//g, ".");

      if (!path && err.keyword === "required" && err.params.missingProperty) {
        path = err.params.missingProperty;
      }
      
      let message = err.message || "";
      if (err.keyword === "additionalProperties") {
        message = `has additional property '${err.params.additionalProperty}'`;
      } else if (err.keyword === "required") {
        message = `requires property '${err.params.missingProperty}'`;
      } else if (err.keyword === "type") {
        message = `is of type ${typeof err.data} but expected ${err.params.type}`;
      } else if (err.keyword === "const") {
        message = `must be equal to constant ${JSON.stringify(err.params.allowedValue)}`;
      } else if (err.keyword === "enum") {
        message = `must be equal to one of the allowed values: ${err.params.allowedValues.join(", ")}`;
      }
      
      const pathArray = path ? pathToArray(path) : [];
      const line = path ? getLineForPath(yamlString, pathArray) : null;
      
      return {
        line: line,
        message: path ? `${path} ${message}` : message,
        scope: "schema"
      };
    });
  }
  
  return {
    docModel: docModel,
    errors: errors
  };
};

export const validateCustomSchemaClosure = schema => (jsonObj, yamlString) =>
  validateCustomSchema(jsonObj, yamlString, schema);

const validateProjectSchema = validateCustomSchemaClosure(projectSchema);

export default validateProjectSchema;