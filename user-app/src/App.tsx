// @ts-ignore
import logo from "./logo.svg";
import "./App.css";

import {
  ClerkProvider,
  SignIn,
  SignedIn,
  SignedOut,
  UserButton,
  SignUp,
} from "@clerk/clerk-react";

// import { ChakraProvider } from "@chakra-ui/react";
// import { Button } from "@chakra-ui/react";

function Layout() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <SignedIn>
          <UserButton></UserButton>
        </SignedIn>
        <SignedOut>
          <SignIn></SignIn>
        </SignedOut>
      </header>
    </div>
  );
}

export default function App() {
  return (
    // <ChakraProvider>
      <ClerkProvider publishableKey="pk_test_cG9saXNoZWQtc2hyaW1wLTAuY2xlcmsuYWNjb3VudHMuZGV2JA">
        <Layout />
      </ClerkProvider>
    // </ChakraProvider>
  );
}
