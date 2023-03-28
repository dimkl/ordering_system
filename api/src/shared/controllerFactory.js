const compose = require("koa-compose");
const { DiscoveryApiFactory } = require("@dimkl/ajv-discovery-api");

const verifyToken = require("./middlewares/verifyToken");
const authorize = require("./middlewares/authorize");

class ControllerFactory {
  static create({ handler, schema, scopes = [] }) {
    const middlewares = [];

    if (scopes.length > 0) {
      middlewares.push(verifyToken());
      middlewares.push(authorize(scopes));
    }
    if (schema) {
      middlewares.push(this.validateMiddleware(schema));
    }
    if (handler) {
      middlewares.push(handler);
    }

    return compose(middlewares);
  }

  static validateMiddleware(schema) {
    const discoveryApi = DiscoveryApiFactory.getInstance();
    discoveryApi.registerSchema(schema);

    return async function validate(ctx, next) {
      await discoveryApi.validateSchema({
        schema,
        dataAccessor: () => ctx.request.body,
        dataSetter: (dt) => {
          ctx.request.validatedData = dt;
        },
      });

      return next();
    };
  }
}

module.exports = ControllerFactory;
