import React, { ReactNode } from "react";
import { NavBar } from "./NavBar";
import { Wrapper } from "./Wrapper";

interface LayoutProps {
  big?: boolean;
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ big, children }) => {
  return (
    <>
      <NavBar />
      <Wrapper big={true}>{children}</Wrapper>
    </>
  );
};
