// @ts-ignore
import logo from "./logo.svg";
import "./App.css";

// 1. import `ChakraProvider` component
import { ChakraProvider } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";

function App() {
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
        <Button>Chakra button</Button>
      </header>
    </div>
  );
}

export default () => {
  return (
    <ChakraProvider>
      <App />
    </ChakraProvider>
  );
};
