import * as React from "react";

// 1. import `ChakraProvider` component
import { ChakraProvider } from "@chakra-ui/react";
import { ClerkProvider } from "@clerk/clerk-react";
import { Layout } from "./Layout";

export function App() {
  // 2. Wrap ChakraProvider at the root of your app
  return (
    <ChakraProvider>
      <ClerkProvider publishableKey="pk_test_d2FudGVkLXJlaW5kZWVyLTY5LmNsZXJrLmFjY291bnRzLmRldiQ">
        <Layout />
      </ClerkProvider>
    </ChakraProvider>
  );
}
