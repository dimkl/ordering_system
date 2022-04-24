const Ajv = require("ajv");
const addFormats = require('ajv-formats');
const addKeywords = require('./addKeywords');
const addDefinitions = require('./addDefinitions');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
addKeywords(ajv);
addDefinitions(ajv);

module.exports = ajv;