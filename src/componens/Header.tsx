import {
  ClerkLoading,
  SignInButton,
  SignOutButton,
  useUser,
} from "@clerk/nextjs";

import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Text,
  Title,
  Tooltip,
  Loader,
  Alert,
  MediaQuery,
  Burger,
  Drawer,
  Stack,
  type ColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAlertCircle } from "@tabler/icons-react";
import { IconMoonFilled, IconSunFilled } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useState } from "react";

interface HeaderProps {
  theme: ColorScheme;
  onTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onTheme }) => {
  const router = useRouter();
  const user = useUser();
  const [alert, setAlert] = useState(false);
  const [opened, { toggle, close }] = useDisclosure(false);

  const handleAuth = (to: string) => {
    if (alert) return;
    if (!user.user) {
      setAlert(true);
      return;
    }
    void router.replace(to);
    close();
  };

  const label = opened ? "Close navigation" : "Open navigation";

  return (
    <>
      <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
        <Alert
          sx={{ display: !alert ? "none" : "block" }}
          withCloseButton
          onClose={() => setAlert(false)}
          icon={<IconAlertCircle size="1rem" />}
          title="Authorization Error!"
          color="red"
        >
          Please Sign In first to access this feature!
        </Alert>
      </MediaQuery>
      <Box py={".5rem"} px={"1rem"}>
        <Flex justify={"space-between"} align={"center"}>
          <Title
            color="blue"
            onClick={() => void router.replace("/")}
            sx={{
              cursor: "pointer",
              transition: "transform 200ms ease-in-out",
              ":hover": {
                transform: "translateX(.5rem)",
              },
            }}
          >
            theater.io
          </Title>
          <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
            <Flex align={"center"} gap={"md"}>
              <Flex align={"center"}>
                <Button
                  size={"lg"}
                  radius={"xs"}
                  variant="subtle"
                  color="gray"
                  onClick={() => void router.replace("/movies")}
                >
                  Movies
                </Button>
                <Button
                  size={"lg"}
                  radius={"xs"}
                  variant="subtle"
                  color="gray"
                  onClick={() => handleAuth("/tickets")}
                >
                  Tickets
                </Button>
                <Button
                  size={"lg"}
                  radius={"xs"}
                  variant="subtle"
                  color="gray"
                  onClick={() => handleAuth("/reserve")}
                >
                  Reserve
                </Button>
                <Button
                  size={"lg"}
                  radius={"xs"}
                  variant="subtle"
                  color="gray"
                  onClick={() => void router.replace("/info")}
                >
                  Info
                </Button>
              </Flex>
              <Flex align={"center"} gap={"md"}>
                <ClerkLoading>
                  <Loader />
                </ClerkLoading>
                {!user.isSignedIn && (
                  <SignInButton>
                    <Button size="md">Sign In</Button>
                  </SignInButton>
                )}
                {user.isSignedIn && (
                  <SignOutButton>
                    <Tooltip label="Sign Out" position="bottom" withArrow>
                      <Button size="md" variant="outline">
                        <Avatar
                          size={32}
                          src={user.user.profileImageUrl}
                          alt={`${
                            user.user.username ?? "user"
                          } profile picture`}
                          radius={"xl"}
                          mr={".5rem"}
                        />
                        <Text>
                          {user.user?.username ||
                            `${user.user?.firstName ?? ""} ${
                              user.user?.lastName ?? ""
                            }`}
                        </Text>
                      </Button>
                    </Tooltip>
                  </SignOutButton>
                )}
                <ThemeModeIcon theme={theme} onTheme={onTheme} />
              </Flex>
            </Flex>
          </MediaQuery>
          <MediaQuery largerThan={"md"} styles={{ display: "none" }}>
            <Box>
              <Burger opened={opened} onClick={toggle} aria-label={label} />
              <Drawer
                size={"xs"}
                opened={opened}
                onClose={close}
                position="right"
                closeButtonProps={{ size: "lg" }}
                overlayProps={{ opacity: 0.5, blur: 4 }}
              >
                <Stack align="flex-end" spacing={"sm"}>
                  <Title
                    color="blue"
                    onClick={() => {
                      void router.replace("/");
                      close();
                    }}
                    sx={{
                      cursor: "pointer",
                      transition: "transform 200ms ease-in-out",
                      ":hover": {
                        transform: "translateX(-0.5rem)",
                      },
                    }}
                  >
                    theater.io
                  </Title>
                  <Divider w={"100%"} />
                  <Text
                    w={"100%"}
                    ta={"end"}
                    size={"xl"}
                    sx={{
                      cursor: "pointer",
                      ":hover": {
                        transition: "all 200ms ease-in-out",
                        transform: "translateX(-0.5rem)",
                        color: "#1C7ED6",
                      },
                    }}
                    onClick={() => {
                      void router.replace("/movies");
                      close();
                    }}
                  >
                    Movies
                  </Text>
                  <Divider w={"100%"} />
                  <Text
                    w={"100%"}
                    ta={"end"}
                    size={"xl"}
                    sx={{
                      cursor: "pointer",
                      ":hover": {
                        transition: "all 200ms ease-in-out",
                        transform: "translateX(-0.5rem)",
                        color: "#1C7ED6",
                      },
                    }}
                    onClick={() => handleAuth("/tickets")}
                  >
                    Tickets
                  </Text>
                  <Divider w={"100%"} />
                  <Text
                    w={"100%"}
                    ta={"end"}
                    size={"xl"}
                    sx={{
                      cursor: "pointer",
                      ":hover": {
                        transition: "all 200ms ease-in-out",
                        transform: "translateX(-0.5rem)",
                        color: "#1C7ED6",
                      },
                    }}
                    onClick={() => handleAuth("/reserve")}
                  >
                    Reserve
                  </Text>
                  <Divider w={"100%"} />
                  <Text
                    w={"100%"}
                    ta={"end"}
                    size={"xl"}
                    sx={{
                      cursor: "pointer",
                      ":hover": {
                        transition: "all 200ms ease-in-out",
                        transform: "translateX(-0.5rem)",
                        color: "#1C7ED6",
                      },
                    }}
                    onClick={() => {
                      void router.replace("/info");
                      close();
                    }}
                  >
                    Info
                  </Text>
                  <Divider w={"100%"} />
                  <Flex align={"center"} gap={"md"}>
                    <ClerkLoading>
                      <Loader />
                    </ClerkLoading>
                    {!user.isSignedIn && (
                      <SignInButton>
                        <Button size="md">Sign In</Button>
                      </SignInButton>
                    )}
                    {user.isSignedIn && (
                      <SignOutButton>
                        <Tooltip label="Sign Out" position="bottom" withArrow>
                          <Button size="md" variant="outline">
                            <Avatar
                              size={32}
                              src={user.user.profileImageUrl}
                              alt={`${
                                user.user.username ?? "user"
                              } profile picture`}
                              radius={"xl"}
                              mr={".5rem"}
                            />
                            <Text>{user.user.username}</Text>
                          </Button>
                        </Tooltip>
                      </SignOutButton>
                    )}
                  </Flex>
                  <Divider w={"100%"} />
                  <ThemeModeIcon theme={theme} onTheme={onTheme} />
                  <Divider w={"100%"} />
                  <MediaQuery largerThan={"md"} styles={{ display: "none" }}>
                    <Alert
                      sx={{ display: !alert ? "none" : "block" }}
                      withCloseButton
                      onClose={() => setAlert(false)}
                      icon={<IconAlertCircle size="1rem" />}
                      title="Authorization Error!"
                      color="red"
                    >
                      Please Sign In first to access this feature!
                    </Alert>
                  </MediaQuery>
                </Stack>
              </Drawer>
            </Box>
          </MediaQuery>
        </Flex>
      </Box>
      <Divider mb={"1rem"} />
    </>
  );
};

const ThemeModeIcon: React.FC<{ theme: ColorScheme; onTheme: () => void }> = ({
  theme,
  onTheme,
}) => {
  return (
    <ActionIcon size="lg" onClick={onTheme} color="gray">
      {theme === "light" ? (
        <IconMoonFilled size="1.9rem" />
      ) : (
        <IconSunFilled size="1.9rem" />
      )}
    </ActionIcon>
  );
};

export default Header;
