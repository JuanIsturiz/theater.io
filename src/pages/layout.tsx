import { type ColorScheme, Container, MantineProvider } from "@mantine/core";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { type FC, type ReactNode, useState } from "react";
import Footer from "~/componens/Footer";
import Header from "~/componens/Header";
import ScrollButton from "~/componens/ScrollButton";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const [theme, setTheme] = useState<ColorScheme>("dark");
  const router = useRouter();
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
        <AnimatePresence mode="wait">
          <motion.div
            key={router.route}
            transition={{
              duration: 0.4,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              transition={{
                duration: 0.4,
              }}
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Header theme={theme} onTheme={handleTheme} />
            </motion.div>
            <motion.div
              transition={{
                delay: 0.2,
                duration: 0.4,
              }}
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Container size={"xl"}>{children}</Container>
            </motion.div>
            <motion.div
              transition={{
                delay: 0.4,
                duration: 0.4,
              }}
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Footer theme={theme} />
            </motion.div>
            <ScrollButton />
          </motion.div>
        </AnimatePresence>
      </MantineProvider>
    </>
  );
};

export default Layout;
