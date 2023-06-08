import { ClerkProvider } from "@clerk/nextjs";
import { ColorScheme, Container, MantineProvider } from "@mantine/core";
import { FC, ReactNode, useState } from "react";
import Header from "~/componens/Header";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const [theme, setTheme] = useState<ColorScheme>("dark");

  const handleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: theme,
        }}
      >
        <ClerkProvider>
          <Header theme={theme} onTheme={handleTheme} />
          <Container>{children}</Container>
        </ClerkProvider>
      </MantineProvider>
    </>
  );
};

export default Layout;
