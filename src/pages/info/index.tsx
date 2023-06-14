import { Box, Divider, Group, Text, Title, rem } from "@mantine/core";
import { NextPage } from "next";

const Info: NextPage = () => {
  return (
    <main>
      <Title tt={"uppercase"} align="center" weight={"normal"}>
        Info
      </Title>
      <Text align="center" mb={"1rem"} opacity={0.6}>
        Learn more about us!
      </Text>
      <Box mb={rem(30)}>
        <Title order={2} weight={"normal"} mb={rem(10)}>
          About Us
        </Title>
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti
          dicta nulla voluptatem repudiandae illum, temporibus excepturi in eos
          ut molestias sequi impedit reprehenderit ad laboriosam magnam debitis
          adipisci dignissimos consequatur assumenda facere velit? Maxime,
          pariatur mollitia voluptatum blanditiis eos fugiat temporibus eius sed
          ducimus deserunt dolores accusamus eligendi nulla laudantium expedita
          nesciunt nihil, dolorem at magni autem. Quos neque quidem aperiam
          ipsum, quo veniam dolores eius quisquam dolor odit atque facilis unde,
          reiciendis amet perferendis.
        </Text>
      </Box>
      <Box mb={rem(30)}>
        <Title order={2} weight={"normal"} mb={rem(7.5)}>
          Schedules
        </Title>
        <Group spacing={"xs"}>
          <Divider orientation="vertical" />
          <Box
            px={rem(10)}
            sx={(theme) => ({
              textAlign: "center",
              ":hover": {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.gray[9]
                    : theme.colors.gray[1],
              },
            })}
          >
            <Text tt={"uppercase"} size={"xl"} color="blue">
              sunday
            </Text>
            <Text opacity={0.8}>11:00AM - 2:00AM</Text>
          </Box>
          <Divider orientation="vertical" />
          <Box
            px={rem(10)}
            sx={(theme) => ({
              textAlign: "center",
              ":hover": {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.gray[9]
                    : theme.colors.gray[1],
              },
            })}
          >
            <Text tt={"uppercase"} size={"xl"} color="red">
              monday
            </Text>
            <Text opacity={0.8}>CLOSED</Text>
          </Box>
          <Divider orientation="vertical" />
          <Box
            px={rem(10)}
            sx={(theme) => ({
              textAlign: "center",
              ":hover": {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.gray[9]
                    : theme.colors.gray[1],
              },
            })}
          >
            <Text tt={"uppercase"} size={"xl"} color="blue">
              thursday
            </Text>
            <Text opacity={0.8}>1:30PM - 11:30PM</Text>
          </Box>
          <Divider orientation="vertical" />
          <Box
            px={rem(10)}
            sx={(theme) => ({
              textAlign: "center",
              ":hover": {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.gray[9]
                    : theme.colors.gray[1],
              },
            })}
          >
            <Text tt={"uppercase"} size={"xl"} color="blue">
              wednesday
            </Text>
            <Text opacity={0.8}>1:30PM - 11:30PM</Text>
          </Box>
          <Divider orientation="vertical" />
          <Box
            px={rem(10)}
            sx={(theme) => ({
              textAlign: "center",
              ":hover": {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.gray[9]
                    : theme.colors.gray[1],
              },
            })}
          >
            <Text tt={"uppercase"} size={"xl"} color="blue">
              friday
            </Text>
            <Text opacity={0.8}>11:00AM - 2:00AM</Text>
          </Box>
          <Divider orientation="vertical" />
          <Box
            px={rem(10)}
            sx={(theme) => ({
              textAlign: "center",
              ":hover": {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.gray[9]
                    : theme.colors.gray[1],
              },
            })}
          >
            <Text tt={"uppercase"} size={"xl"} color="blue">
              saturday
            </Text>
            <Text opacity={0.8}>11:00AM - 2:00AM</Text>
          </Box>
          <Divider orientation="vertical" />
        </Group>
      </Box>
      <Box mb={rem(30)}>
        <Title order={2} weight={"normal"} mb={rem(10)}>
          Location
        </Title>
      </Box>
    </main>
  );
};

export default Info;
