const Ajv = require("ajv");
const addFormats = require('ajv-formats');
const addKeywords = require('./addKeywords');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
addKeywords(ajv);

module.exports = ajv;