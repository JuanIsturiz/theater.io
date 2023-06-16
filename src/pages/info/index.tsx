import {
  Box,
  Divider,
  Flex,
  Group,
  Stack,
  Text,
  Title,
  rem,
} from "@mantine/core";
import { useLoadScript, GoogleMap, MarkerF } from "@react-google-maps/api";
import { NextPage } from "next";
import { useMemo } from "react";
import { env } from "~/env.mjs";
import styles from "~/styles/info.module.css";

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
          Location & Contact Info
        </Title>
        <Flex gap={"xl"}>
          <Map />
          <Stack spacing={"xl"}>
            <Box>
              <Text size={"lg"} weight={500} opacity={0.8}>
                Street Address
              </Text>
              <Text size={rem(24)}>
                2823 Nottingham Way, Albany, GA 31707, United States
              </Text>
            </Box>
            <Box>
              <Text size={"lg"} weight={500} opacity={0.8}>
                Email Address
              </Text>
              <Text size={rem(24)}>theater.io@mail.com</Text>
            </Box>
            <Box>
              <Text size={"lg"} weight={500} opacity={0.8}>
                Phone Number
              </Text>
              <Text size={rem(24)}>+1 555-555-5555</Text>
            </Box>
          </Stack>
        </Flex>
      </Box>
    </main>
  );
};

const Map: React.FC = () => {
  const { isLoaded } = useLoadScript({
    id: "google-map-script",
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const center = useMemo(() => ({ lat: 44, lng: -80 }), []);

  return (
    <Box>
      {isLoaded && (
        <GoogleMap
          zoom={10}
          center={center}
          mapContainerClassName={styles["google-map"]}
        >
          <MarkerF position={center} />
        </GoogleMap>
      )}
    </Box>
  );
};

export default Info;
