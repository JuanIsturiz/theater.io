import { Box, Button, Center, Group, Stack, Title } from "@mantine/core";
import { IconMoodSad } from "@tabler/icons-react";
import type { NextPage } from "next";
import Link from "next/link";

const Custom404: NextPage = () => {
  return (
    <Center my={"6rem"}>
      <Stack>
        <Group align="center" spacing={"xs"}>
          <Title
            weight={500}
            sx={{
              "@media (max-width: 40em)": {
                fontSize: "1.5rem",
              },
            }}
          >
            404 - Page Not Found
          </Title>
          <IconMoodSad size={"2rem"} />
        </Group>
        <Box mx={"auto"}>
          <Link href={"/"}>
            <Button>Return to Homepage</Button>
          </Link>
        </Box>
      </Stack>
    </Center>
  );
};

export default Custom404;
