import { RequestError } from "../errors";
import { debug } from "debug";

const debugLog = debug("api:apiVersion");

export const apiVersion = (versions: string[]) => {
  const supportedVersions = versions.sort().reverse();

  return (ctx, next) => {
    if (supportedVersions.length === 0) {
      return next();
    }

    const selectedVersion = supportedVersions.find((v) => v <= ctx.params.version);
    if (!selectedVersion) {
      throw new RequestError("Provided version is not supported!");
    }

    debugLog({ version: ctx.params.version, selectedVersion });

    ctx.state.version = selectedVersion;

    return next();
  };
};
