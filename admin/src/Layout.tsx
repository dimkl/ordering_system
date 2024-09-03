import { Box, Center, Flex, HStack, Spacer, useColorModeValue } from "@chakra-ui/react";

import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/clerk-react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NavLink } from "./components/NavLink";
import { IngredientForm } from "./components/products/IngredientForm";
import { IngredientList } from "./components/products/IngredientList";
import { ProductForm } from "./components/products/ProductForm";
import { ProductIngredientForm } from "./components/products/ProductIngredientForm";
import { ProductList } from "./components/products/ProductList";
import { SectionForm } from "./components/shops/SectionForm";
import { ShopForm } from "./components/shops/ShopForm";
import { ShopList } from "./components/shops/ShopList";
import { SlotForm } from "./components/shops/SlotForm";

export function Layout() {
  return (
    <>
      <SignedIn>
        <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
          <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
            <HStack spacing={8} alignItems={"center"}>
              <NavLink text="🛒" link="/" />
              <NavLink text="Shops" link="/shops" />
              <NavLink text="Products" link="/products" />
              <NavLink text="Ingredients" link="/ingredients" />
            </HStack>
            <Flex alignItems={"center"}>
              <UserButton />
            </Flex>
          </Flex>
        </Box>
        <Box p={4}>
          <BrowserRouter>
            <Routes>
              <Route path="/ingredients" element={<IngredientList />}></Route>
              <Route path="/products" element={<ProductList />}></Route>
              <Route path="/shops" element={<ShopList />}></Route>
              <Route
                path="/"
                element={
                  <>
                    <Flex>
                      <Box flex={1}>
                        <ShopForm />
                      </Box>
                      <Spacer flex={0.1} />
                      <Box flex={1}>
                        <SectionForm />
                      </Box>
                      <Spacer flex={0.1} />
                      <Box flex={1}>
                        <SlotForm />
                      </Box>
                    </Flex>
                    <IngredientForm />
                    <ProductForm />
                    <ProductIngredientForm />
                  </>
                }
              ></Route>
            </Routes>
          </BrowserRouter>
        </Box>
      </SignedIn>
      <SignedOut>
        <Center p={4}>
          <SignIn />
        </Center>
      </SignedOut>
    </>
  );
}
