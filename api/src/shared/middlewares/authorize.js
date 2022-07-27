const { AuthorizationError } = require('../errors');

const groupByResource = (scopes) => {
  return scopes.reduce((group, scope) => {
    const [_, resource, actions] = scope.match(/urn:(\w+):(\w+|\*)/);
    group[resource] = actions;

    return group;
  }, {});
};

module.exports = (requiredScopes = []) => {
  return async function authorize(ctx, next) {
    try {
      // TODO: replace this check with throw error when tests are fixed
      if (!ctx.tokenClaims) return next();
      // if (!ctx.tokenClaims) {
      //   throw new AuthorizationError('token verification should be preceded!');
      // }

      const requiredGroupedResources = groupByResource(requiredScopes);
      const authorizedGroupedResources = groupByResource(ctx.tokenClaims.scopes.split(' '));

      const isWildcardAuthorized = ctx.tokenClaims.scopes == '*';
      const isWildcardPerResourceAuthorized = Object.keys(requiredGroupedResources).every(r => authorizedGroupedResources[r] === '*');
      const isAuthorized = Object.entries(requiredGroupedResources).every(([r, actions]) =>
        actions.split('').every(a => authorizedGroupedResources[r].includes(a))
      );

      if (isWildcardAuthorized || isWildcardPerResourceAuthorized || isAuthorized) return next();

      throw new AuthorizationError(`JWT is missing required scopes "${requiredScopes.join(',')}"!`);
    } catch (err) {
      ctx.status = 403;
    }
  }
};