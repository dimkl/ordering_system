import type { AnySchema } from "ajv";
import type { Context, Next, Middleware } from "koa";

import compose from "koa-compose";
import { DiscoveryApiFactory } from "@dimkl/ajv-discovery-api";

import { createAuthorize } from "./middlewares/authorize";

const discoveryApi = DiscoveryApiFactory.getInstance();

type createControllerParams = {
  handler: Middleware;
  schema?: AnySchema;
  scopes?: string[];
};

function validateMiddleware(schema: AnySchema) {
  discoveryApi.registerSchema(schema);

  return async function validate(ctx: Context, next: Next) {
    await discoveryApi.validateSchema({
      schema,
      dataAccessor: () => {
        if (Array.isArray(ctx.request.body)) {
          return ctx.request.body.map((body) => {
            return { ...ctx.params, ...ctx.query, ...body };
          });
        }

        return { ...ctx.params, ...(ctx.request.body || {}), ...ctx.query };
      },
      dataSetter: (dt) => {
        // @ts-expect-error validatedData are added as part of the request validation
        ctx.request.validatedData = dt;
        // It will replace the ctx.request.validatedData
        ctx.validatedData = dt;
      }
    });

    return next();
  };
}

export function createController({ handler, schema, scopes = [] }: createControllerParams) {
  const middlewares: Middleware[] = [];

  if (scopes.length > 0) {
    middlewares.push(createAuthorize(scopes));
  }
  if (schema) {
    middlewares.push(validateMiddleware(schema));
  }
  if (handler) {
    middlewares.push(handler);
  }

  return compose(middlewares);
}
