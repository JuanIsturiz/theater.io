import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { type ColorScheme, Container, MantineProvider } from "@mantine/core";
import { type FC, type ReactNode, useState } from "react";
import Footer from "~/componens/Footer";
import Header from "~/componens/Header";
import ScrollButton from "~/componens/ScrollButton";

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
        <ClerkProvider
          appearance={{
            baseTheme: dark,
          }}
        >
          <Header theme={theme} onTheme={handleTheme} />
          <Container size={"xl"}>{children}</Container>
          <Footer theme={theme} />
          <ScrollButton />
        </ClerkProvider>
      </MantineProvider>
    </>
  );
};

export default Layout;
