const JOI = require("joi");
const { VALIDATION_ERROR } = require("../config/constants");

/* Pick required fields from the request object */
const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

/* Validate params */
exports.validateParams = (schema) => (req, res, next) => {
  try {
    const validSchema = pick(schema, ["params", "query", "body"]);
    const extractedParams = pick(req, Object.keys(validSchema));

    const { error } = JOI.compile(validSchema)
      .prefs({ errors: { label: "key" }, abortEarly: false })
      .validate(extractedParams);

    if (error) {
      let errors = [];
      error.details.map((details) =>
        errors.push({ key: details?.context?.key, message: details?.message })
      );
      return res.send({
        status: VALIDATION_ERROR,
        message: "Invalid request",
        errors: errors,
        data: [],
      });
    }

    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
