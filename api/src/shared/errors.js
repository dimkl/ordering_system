class BusinessError extends Error { };

class AuthorizationError extends Error { };

module.exports = { BusinessError, AuthorizationError };