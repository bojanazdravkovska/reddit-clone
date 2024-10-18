import { Box } from "@chakra-ui/react";
import React, { ReactNode } from "react";

interface WrapperProps {
  big?: boolean;
  children: ReactNode;
}

export const Wrapper: React.FC<WrapperProps> = ({ big = true, children }) => {
  return (
    <Box mt={8} mx={"auto"} maxW={big ? "800px" : "400px"} w={"100%"}>
      {children}
    </Box>
  );
};
