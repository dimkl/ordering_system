import { Box, useColorModeValue } from "@chakra-ui/react";

export function NavLink({ text, link }: { text: string; link: string }) {
  return (
    <Box
      as={"a"}
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700")
      }}
      href={link}
    >
      {text}
    </Box>
  );
}
