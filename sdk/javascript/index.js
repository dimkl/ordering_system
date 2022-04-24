const fetch = require('isomorphic-fetch');
const Ajv = require("ajv");
const addFormats = require('ajv-formats');

// see: api/src/shared/addKeywords.js
function addKeywords(ajv) {
  ajv.addKeyword({
    keyword: "http_method",
    validate: () => true,
    errors: false,
  });
  ajv.addKeyword({
    keyword: "http_path",
    validate: () => true,
    errors: false,
  });
}

function createApi(schemas) {
  return schemas.reduce((api, schema) => {
    if (schema["http_path"] && schema["http_method"]) {
      // convert method to camel case
      const apiMethod = schema["$id"]
        .replace('/schemas/', '')
        .replace(/(\.(\w))/, (_1, _2, a) => a.toUpperCase());
      api[apiMethod] = schema["$id"];
    }

    return api;
  }, {});
}

async function request(endpoint, jwt, body, options = {}) {
  const fetchOptions = {
    headers: { 'Content-Type': 'application/json' },
    mode: 'no-cors',
    ...options
  };

  if (jwt) {
    fetchOptions.headers['Authentication'] = `Bearer ${jwt}`;
  }

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  return fetch(endpoint, fetchOptions).then((response) => {
    const jsonResponse = response.json();

    if (response.status >= 400) throw new Error(jsonResponse);

    return jsonResponse;
  });
}
class SDK {
  constructor(schemas, apiUrl, jwt) {
    this.apiUrl = apiUrl;
    this.jwt = jwt;

    this.ajv = new Ajv({ allErrors: true, schemas });
    addFormats(this.ajv);
    addKeywords(this.ajv);

    const api = createApi(schemas);
    Object.entries(api).map(([methodName, schemaId]) => {
      this[methodName] = this.handler.bind(this, schemaId);
    });
  }

  async handler(schemaId, body, params = {}) {
    const schema = this.ajv.getSchema(schemaId).schema;
    const { http_path: path, http_method: method } = schema;

    const validate = this.ajv.compile(schema);
    const data = await validate(body);

    const requestPath = path.replace(/:([\w]+)/, (_, a) => params[a]);
    const requestUrl = (new URL(requestPath, this.apiUrl)).href;
    return request(requestUrl, this.jwt, data, { method });
  }
}

async function SDKFactory({ apiUrl, path = '/discovery', jwt }) {
  const { schemas } = await request(new URL(path, apiUrl).href);

  return new SDK(schemas, apiUrl, jwt);
}

module.exports = SDKFactory;
