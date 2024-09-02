import { RequestError } from "../errors";
import { debug } from "debug";

const debugLog = debug("api:included");

/**
 * Included middleware uses the `include` query parameter value
 * defined as a comma separated list of resources to be added in
 * the response payload if they are supported by the API.
 *
 * see: https://jsonapi.org/format/#fetching-includes
 */
export const included = (relations: string[]) => {
  const supportedRelations = relations.sort().reverse();

  return (ctx, next) => {
    if (supportedRelations.length === 0) {
      return next();
    }

    const requestedResources = ctx.query.include?.split(",") || [];
    const selectedResources = supportedRelations.filter((v) =>
      requestedResources.find((rv) => rv === v)
    );

    if (requestedResources.length && !selectedResources.length) {
      throw new RequestError(
        "Provided resource is not supported! Update the `include` query param with the correct value(s)."
      );
    }

    debugLog({ include: ctx.query.include, selectedResources });

    ctx.state.included = selectedResources;

    return next();
  };
};
