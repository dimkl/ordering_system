import { debug } from "debug";

const debugLog = debug("api:error");

export const cors = (origins: string[]) => {
  return (ctx, next) => {
    const origin = ctx.headers["origin"] || "";

    debugLog("cors: allowed %v vs current%v", origins, origin);

    if (!origins.includes(origin)) {
      return;
    }

    const headers = ctx.response.headers;
    headers["Acess-Control-Allow-Origin"] = origin;
    headers["Acess-Control-Allow-Methods"] = "GET,HEAD,POST,PUT,PATCH";
    headers["Access-Control-Allow-Credentials"] = true;

    return next();
  };
};
