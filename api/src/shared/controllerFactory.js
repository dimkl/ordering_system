const compose = require("koa-compose");
const { DiscoveryApiFactory } = require("@dimkl/ajv-discovery-api");

const discoveryApi = DiscoveryApiFactory.getInstance();
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
    discoveryApi.registerSchema(schema);

    return async function validate(ctx, next) {
      await discoveryApi.validateSchema({
        schema,
        dataAccessor: () => {
          return { ...ctx.params, ...ctx.request.body };
        },
        dataSetter: (dt) => {
          ctx.request.validatedData = dt;
        },
      });

      return next();
    };
  }
}

module.exports = ControllerFactory;
