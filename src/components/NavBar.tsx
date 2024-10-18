import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { useApolloClient } from "@apollo/client";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [logout] = useLogoutMutation();
  const [isServer, setIsServer] = useState(true);
  const { data } = useMeQuery({ skip: isServer });
  console.log(data);
  const apolloClient = useApolloClient();
  useEffect(() => {
    setIsServer(false);
  }, []);
  let body = null;

  if (isServer) {
    body = <Box>Loading...</Box>;
  } else if (!data?.me) {
    body = (
      <Box>
        <NextLink href={"/register"}>
          <Button bg={"lavender"} mr={8}>
            Register
          </Button>
        </NextLink>
        <NextLink href={"/login"}>
          <Button bg={"lavender"}>Login</Button>
        </NextLink>
      </Box>
    );
  } else {
    body = (
      <Flex align={"center"}>
        <Box mr={4}>Welcome {data.me.username}!</Box>
        <Button
          onClick={async () => {
            logout();
            await apolloClient.resetStore();
          }}
          bg={"lavender"}
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex
      p={3}
      bg={"goldenrod"}
      zIndex={1}
      position="sticky"
      top={0}
      justify={"space-between"}
      align={"center"}
    >
      <Box>
        <NextLink href={"/"}>
          <Heading>Reddit Clone</Heading>
        </NextLink>
      </Box>

      <Box>{body}</Box>
    </Flex>
  );
};
