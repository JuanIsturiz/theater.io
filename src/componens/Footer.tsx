import {
  ActionIcon,
  Box,
  Divider,
  Group,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import {
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandYoutube,
} from "@tabler/icons-react";
import Link from "next/link";

interface FooterProps {
  theme: string;
}

const Footer: React.FC<FooterProps> = ({ theme }) => {
  return (
    <Box
      mt={"3rem"}
      py={".5rem"}
      px={"1rem"}
      bg={theme === "dark" ? "dark" : "gray.2"}
    >
      <SimpleGrid
        cols={3}
        spacing="4rem"
        breakpoints={[
          { maxWidth: "md", cols: 3, spacing: "md" },
          { maxWidth: "sm", cols: 2, spacing: "sm" },
          { maxWidth: "xs", cols: 1, spacing: "sm" },
        ]}
      >
        <Box>
          <Title color="blue">theater.io</Title>
          <Text>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facere qui
            ipsum quaerat deleniti? Voluptatum perspiciatis aperiam dolore
            numquam aut, pariatur id eius ducimus explicabo unde?
          </Text>
        </Box>
        <Box mt={".75rem"}>
          <Text weight={"bold"} opacity={0.7}>
            Information
          </Text>
          <Text
            sx={{
              ":hover": {
                textDecoration: "underline",
              },
            }}
          >
            <Link href={"/info"}>About Us</Link>
          </Text>
          <Text
            sx={{
              ":hover": {
                textDecoration: "underline",
              },
            }}
          >
            <Link href={"/info"}>Location</Link>
          </Text>
          <Text
            sx={{
              ":hover": {
                textDecoration: "underline",
              },
            }}
          >
            <Link href={"/info"}>Schedules</Link>
          </Text>
        </Box>
        <Box>
          <Title mb={".25rem"}>Socials</Title>
          <Group>
            <ActionIcon
              size={"lg"}
              color={theme === "dark" ? "gray.5" : "gray.8"}
            >
              <IconBrandInstagram size="3rem" />
            </ActionIcon>
            <ActionIcon
              size={"lg"}
              color={theme === "dark" ? "gray.5" : "gray.8"}
            >
              <IconBrandTwitter size="3rem" />
            </ActionIcon>
            <ActionIcon
              size={"lg"}
              color={theme === "dark" ? "gray.5" : "gray.8"}
            >
              <IconBrandYoutube size="3rem" />
            </ActionIcon>
          </Group>
        </Box>
      </SimpleGrid>
      <Divider my={".5rem"} />
      <Text size={"lg"} align="center" weight={"bold"}>
        Copyright&copy; 2023 All rights reserved
      </Text>
      <Text size={"lg"} align="center" weight={"bold"}>
        Juan Isturiz
      </Text>
    </Box>
  );
};

export default Footer;
