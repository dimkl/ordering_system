const fetch = require('isomorphic-fetch');

async function request(endpoint, jwt, body, options = {}) {
  const fetchOptions = {
    headers: { 'Content-Type': 'application/json' },
    mode: 'no-cors',
    ...options
  };

  if (jwt) {
    fetchOptions.headers['Authenication'] = `Bearer ${jwt}`;
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
  constructor(api, apiUrl, jwt) {
    this.apiUrl = apiUrl;
    this.jwt = jwt;

    Object.entries(api).map(([methodName, { path, method }]) => {
      this[methodName] = this.handler.bind(this, path, method);
    });
  }

  async handler(path, method, params, body) {
    const requestPath = path.replace(/:([\w]+)/, (_, a) => params[a]);
    const requestUrl = (new URL(requestPath, this.apiUrl)).href;

    return request(requestUrl, this.jwt, body, { method });
  }
}

function createApi(schemas) {
  return schemas.reduce((api, schema) => {
    let apiMethod = schema["$id"].replace('/schemas/', '');
    // convert method to camel case
    apiMethod = apiMethod.replace(/(\.(\w))/, (_1, _2, a) => a.toUpperCase());
    api[apiMethod] = { path: schema["http_path"], method: schema["http_method"] };

    return api;
  }, {});
}

async function SDKFactory({ apiUrl, path = '/discovery', jwt }) {
  const { schemas } = await request(new URL(path, apiUrl).href);

  return new SDK(createApi(schemas), apiUrl, jwt);
}

module.exports = SDKFactory;
