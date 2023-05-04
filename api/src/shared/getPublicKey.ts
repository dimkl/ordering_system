import type { Secret } from "jsonwebtoken";

export const getPublicKey = () => process.env.JWT_PUBLIC_KEY as Secret;
