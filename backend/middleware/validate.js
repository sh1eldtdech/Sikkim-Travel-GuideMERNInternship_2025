const Joi = require("joi");

const formatDetails = (details = []) =>
  details.map((d) => ({ field: d.path.join("."), message: d.message }));

const makeValidator = (source, schema) => (req, res, next) => {
  const { value, error } = schema.validate(req[source], {
    abortEarly: false,
    convert: true,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      message: "Invalid request data",
      errors: formatDetails(error.details),
    });
  }

  req[source] = value;
  return next();
};

const validateBody = (schema) => makeValidator("body", schema);
const validateParams = (schema) => makeValidator("params", schema);
const validateQuery = (schema) => makeValidator("query", schema);

module.exports = {
  Joi,
  validateBody,
  validateParams,
  validateQuery,
};
