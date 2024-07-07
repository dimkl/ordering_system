import { Clerk } from "@clerk/backend";

export const clerkOptions = {
  secretKey: process.env.CLERK_SECRET_KEY || "",
  apiUrl: process.env.CLERK_API_URL || "https://api.clerk.com",
  jwtKey: process.env.CLERK_JWT_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY || "",
  frontendApi: process.env.CLERK_FRONTENT_API || "",
  apiKey: process.env.CLERK_API_KEY || ""
} as const;

export const clerkClient = Clerk(clerkOptions);
