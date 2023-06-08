import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  ColorScheme,
  Divider,
  Flex,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconMoonFilled, IconSunFilled } from "@tabler/icons-react";
import { useRouter } from "next/router";

interface HeaderProps {
  theme: ColorScheme;
  onTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onTheme }) => {
  const router = useRouter();
  const user = useUser();
  return (
    <>
      <Box py={".5rem"} px={"1rem"}>
        <Flex justify={"space-between"} align={"center"}>
          <Title color="blue">theater.io</Title>
          <Flex align={"center"} gap={"md"}>
            <Flex align={"center"}>
              <Button
                size={"lg"}
                radius={"xs"}
                variant="subtle"
                color="gray"
                onClick={() => router.push("/movies")}
              >
                Movies
              </Button>
              <Button
                size={"lg"}
                radius={"xs"}
                variant="subtle"
                color="gray"
                onClick={() => router.push("/tickets")}
              >
                Tickets
              </Button>
              <Button
                size={"lg"}
                radius={"xs"}
                variant="subtle"
                color="gray"
                onClick={() => router.push("/reserve")}
              >
                Reserve
              </Button>
              <Button
                size={"lg"}
                radius={"xs"}
                variant="subtle"
                color="gray"
                onClick={() => router.push("/info")}
              >
                Info
              </Button>
            </Flex>
            <Flex align={"center"} gap={"md"}>
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
                        alt={`${user.user.username} profile picture`}
                        radius={"xl"}
                        mr={".5rem"}
                      />
                      <Text>{user.user.username}</Text>
                    </Button>
                  </Tooltip>
                </SignOutButton>
              )}
              <ThemeModeIcon theme={theme} onTheme={onTheme} />
            </Flex>
          </Flex>
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
