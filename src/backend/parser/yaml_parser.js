import YAML from "js-yaml";

export default function parseYAML(yamlString) {
  let res = {
    jsonObj: null,
    error: null
  };

  try {
    res.jsonObj = YAML.safeLoad(yamlString);
  } catch (error) {
    res.error = {
      line: error.mark.line,
      message: error.message,
      scope: "parsing"
    };
  }

  return res;
}