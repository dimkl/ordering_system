module.exports = (ajv) => {
  ajv.addSchema({
    "$id": "/schemas/defs",
    "title": "Definitions",
    "description": "Type definitions",
    "definitions": {
      "id_or_uuid": {
        "anyOf": [
          {
            "type": "integer",
            "exclusiveMinimum": 0
          },
          {
            "type": "string",
            "format": "uuid"
          }
        ]
      }
    }
  });

};