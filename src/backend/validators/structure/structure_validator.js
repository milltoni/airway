import Ajv from "ajv";
import { getLineForPath } from "../../ast/ast";
import { pathToArray } from "../../PathToArray";
import projectSchema from "./schema";

// Инициализация Ajv с нужными опциями
const ajv = new Ajv({
  allErrors: true,        // собирать все ошибки, а не первую
  verbose: true,          // включать дополнительную информацию (instancePath и т.д.)
  strict: false           // отключаем строгую проверку схем (если нужно)
});

// Функция для кастомной обработки данных (аналог rewrite из jsonschema)
const processDataWithPaths = (data, schemaPath = "#/$defs/language") => {
  if (data === null || typeof data !== "object") {
    return { value: data, base: schemaPath };
  }
  
  if (Array.isArray(data)) {
    const wrappedArray = data.map((item, index) => 
      processDataWithPaths(item, `${schemaPath}/${index}`)
    );
    return { value: wrappedArray, base: schemaPath };
  }
  
  const result = {};
  for (const [key, value] of Object.entries(data)) {
    result[key] = processDataWithPaths(value, `${schemaPath}/${key}`);
  }
  return { value: result, base: schemaPath };
};

const validateCustomSchema = (jsonObj, yamlString, schema) => {
  // 1. Компилируем или используем валидатор
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
  // 2. Выполняем валидацию
  const valid = validate(jsonObj);
  
  // 3. Применяем кастомную обработку данных (аналог rewrite)
  // Сначала оборачиваем данные, добавляя информацию о путях
  const wrappedData = processDataWithPaths(jsonObj);
  
  // Применяем rewrite-логику: данные уже обёрнуты с путями
  // Возвращаем docModel с обёрнутыми значениями (как в оригинале)
  const docModel = wrappedData;
  
  // 4. Обработка ошибок
  let errors = [];
  
  if (!valid && validate.errors) {
    errors = validate.errors.map(err => {
      // Получаем путь из instancePath (формат /property/subproperty)
      let path = err.instancePath || "";
      // Убираем начальный слеш и заменяем / на . для совместимости с оригиналом
      path = path.replace(/^\//, "").replace(/\//g, ".");
      
      // Если путь пустой, но ошибка связана с корнем
      if (!path && err.keyword === "required" && err.params.missingProperty) {
        path = err.params.missingProperty;
      }
      
      // Формируем сообщение как в оригинале
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
      
      // Получаем номер строки из YAML
      const pathArray = path ? pathToArray(path) : [];
      const line = path ? getLineForPath(yamlString, pathArray) : null;
      
      return {
        line: line,
        message: path ? `${path} ${message}` : message,
        scope: "schema"
      };
    });
  }
  
  // 5. Если нет ошибок, но нужно применить rewrite к валидным данным
  // В оригинале rewrite применялся всегда, даже при ошибках
  // Здесь мы уже применили обёртку через processDataWithPaths
  
  return {
    docModel: docModel,
    errors: errors
  };
};

// Каррирование для конкретных схем (функционал сохранён)
export const validateCustomSchemaClosure = schema => (jsonObj, yamlString) =>
  validateCustomSchema(jsonObj, yamlString, schema);

const validateProjectSchema = validateCustomSchemaClosure(projectSchema);

export default validateProjectSchema;