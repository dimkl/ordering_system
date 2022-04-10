const { Model, AjvValidator } = require('objection')
const addFormats = require("ajv-formats");

class BaseModel extends Model {
  static createValidator() {
    return new AjvValidator({
      onCreateAjv: (ajv) => {
        addFormats(ajv);
      },
      options: {
        allErrors: true,
        validateSchema: true,
        ownProperties: true
      },
    });
  }
}

module.exports = BaseModel;