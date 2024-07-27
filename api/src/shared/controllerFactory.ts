import type { AnySchema } from "ajv";
import type { Context, Next, Middleware } from "koa";

import compose from "koa-compose";
import { DiscoveryApiFactory } from "@dimkl/ajv-discovery-api";

import { createAuthorize } from "./middlewares/authorize";

const discoveryApi = DiscoveryApiFactory.getInstance();

type ControllerFactoryParams = {
  handler: Middleware;
  schema?: AnySchema;
  scopes?: string[];
};

export class ControllerFactory {
  static create({ handler, schema, scopes = [] }: ControllerFactoryParams) {
    const middlewares: Middleware[] = [];

    if (scopes.length > 0) {
      middlewares.push(createAuthorize(scopes));
    }
    if (schema) {
      middlewares.push(this.validateMiddleware(schema));
    }
    if (handler) {
      middlewares.push(handler);
    }

    return compose(middlewares);
  }

  static validateMiddleware(schema: AnySchema) {
    discoveryApi.registerSchema(schema);

    return async function validate(ctx: Context, next: Next) {
      await discoveryApi.validateSchema({
        schema,
        dataAccessor: () => {
          if (Array.isArray(ctx.request.body)) {
            return ctx.request.body.map((body) => {
              return { ...ctx.params, ...body };
            });
          }

          return { ...ctx.params, ...(ctx.request.body || {}) };
        },
        dataSetter: (dt) => {
          // @ts-expect-error validatedData are added as part of the request validation
          ctx.request.validatedData = dt;
        }
      });

      return next();
    };
  }
}
