import { Box, Spacer, Flex, HStack, useColorModeValue } from "@chakra-ui/react";

import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/clerk-react";

import { Route, Routes, BrowserRouter } from "react-router-dom";
import { NavLink } from "./components/NavLink";
import { ProductForm } from "./components/ProductForm";
import { ShopForm } from "./components/ShopForm";
import { ShopList } from "./components/ShopList";
import { ProductList } from "./components/ProductList";

export function Layout() {
  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <HStack spacing={8} alignItems={"center"}>
            <NavLink text="🛒" link="/" />
            <NavLink text="Shops" link="/shops" />
            <NavLink text="Products" link="/products" />
          </HStack>
          <Flex alignItems={"center"}>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </Flex>
        </Flex>
      </Box>
      <Box p={4}>
        <BrowserRouter>
          <Routes>
            <Route path="/products" element={<ProductList />}></Route>
            <Route path="/shops" element={<ShopList />}></Route>
            <Route
              path="/"
              element={
                <Flex alignItems={"left"}>
                  <Box flex="2">
                    <ProductForm />
                  </Box>
                  <Spacer flex="0.5" />
                  <Box flex="2">
                    <ShopForm />
                  </Box>
                </Flex>
              }
            ></Route>
          </Routes>
        </BrowserRouter>
      </Box>
    </>
  );
}
