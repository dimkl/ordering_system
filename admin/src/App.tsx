import * as React from "react";

// 1. import `ChakraProvider` component
import { ChakraProvider } from "@chakra-ui/react";
import { ClerkProvider } from "@clerk/clerk-react";
import { Layout } from "./Layout";

export function App() {
  return (
    <ChakraProvider>
      <ClerkProvider publishableKey={process.env.REACT_APP_CLERK_PUBLISHABLE_KEY || ""}>
        <Layout />
      </ClerkProvider>
    </ChakraProvider>
  );
}
