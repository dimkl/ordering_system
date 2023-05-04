import type { AnySchema } from "ajv";
import type { Context, Next } from "koa";
import compose from "koa-compose";
type ControllerFactoryParams = {
    handler: (ctx: Context, next: Next) => {};
    schema?: AnySchema;
    scopes?: string[];
};
export declare class ControllerFactory {
    static create({ handler, schema, scopes }: ControllerFactoryParams): compose.ComposedMiddleware<import("koa").ParameterizedContext<import("koa").DefaultState, import("koa").DefaultContext, any>>;
    static validateMiddleware(schema: AnySchema): (ctx: Context, next: Next) => Promise<any>;
}
export {};
