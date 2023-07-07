import { useUser } from "@clerk/nextjs";
import type { UserResource } from "@clerk/types";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Group,
  Loader,
  LoadingOverlay,
  Rating,
  Stack,
  Text,
  Textarea,
  Title,
  rem,
} from "@mantine/core";
import { useLoadScript, GoogleMap, MarkerF } from "@react-google-maps/api";
import { IconX } from "@tabler/icons-react";
import type { NextPage } from "next";
import React, { type ReactNode, useMemo, useState } from "react";
import { env } from "~/env.mjs";
import styles from "~/styles/info.module.css";
import { type RouterOutputs, api } from "~/utils/api";

type Comment = RouterOutputs["comment"]["getAll"][number];

const Info: NextPage = () => {
  const user = useUser();

  const { data: comments, isLoading } = api.comment.getAll.useQuery();

  if (isLoading) return <LoadingOverlay visible />;

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
          <Weekday>
            <Text tt={"uppercase"} size={"xl"} color="blue">
              sunday
            </Text>
            <Text opacity={0.8}>11:00AM - 2:00AM</Text>
          </Weekday>
          <Divider orientation="vertical" />
          <Weekday>
            <Text tt={"uppercase"} size={"xl"} color="red">
              monday
            </Text>
            <Text opacity={0.8}>CLOSED</Text>
          </Weekday>
          <Divider orientation="vertical" />
          <Weekday>
            <Text tt={"uppercase"} size={"xl"} color="blue">
              thursday
            </Text>
            <Text opacity={0.8}>1:30PM - 11:30PM</Text>
          </Weekday>
          <Divider orientation="vertical" />
          <Weekday>
            <Text tt={"uppercase"} size={"xl"} color="blue">
              wednesday
            </Text>
            <Text opacity={0.8}>1:30PM - 11:30PM</Text>
          </Weekday>
          <Divider orientation="vertical" />
          <Weekday>
            <Text tt={"uppercase"} size={"xl"} color="blue">
              friday
            </Text>
            <Text opacity={0.8}>11:00AM - 2:00AM</Text>
          </Weekday>
          <Divider orientation="vertical" />
          <Weekday>
            <Text tt={"uppercase"} size={"xl"} color="blue">
              saturday
            </Text>
            <Text opacity={0.8}>11:00AM - 2:00AM</Text>
          </Weekday>
          <Divider orientation="vertical" />
        </Group>
      </Box>
      <Box mb={rem(30)}>
        <Title order={2} weight={"normal"} mb={rem(10)}>
          Location & Contact Info
        </Title>
        <Flex
          gap={"xl"}
          sx={{
            "@media (max-width: 40em)": {
              flexDirection: "column",
            },
          }}
        >
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
      <Box>
        <Title order={2} weight={"normal"} mb={rem(10)}>
          Reviews
        </Title>
        {user.isLoaded && user.user && <NewCommentWizard user={user.user} />}
        {comments && <Divider my={rem(20)} w={"90%"} mx={"auto"} />}
        <CommentList comments={comments} user={user.user} />
      </Box>
    </main>
  );
};

const Weekday: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
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
      {children}
    </Box>
  );
};

const NewCommentWizard: React.FC<{ user: UserResource | null | undefined }> = ({
  user,
}) => {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(2.5);

  const ctx = api.useContext();
  const { mutate: createCommentMutation, isLoading } =
    api.comment.create.useMutation({
      async onSuccess() {
        await ctx.comment.getAll.invalidate();
        setContent("");
        setRating(2.5);
      },
    });

  const handleSubmit = () => {
    createCommentMutation({
      userId: user?.id ?? "",
      username:
        user?.username || `${user?.firstName ?? ""} ${user?.lastName ?? ""}`,
      content,
      rating,
    });
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Textarea
        placeholder="I love theater.io!"
        label="Comment Your Experience"
        size="md"
        mb={"sm"}
        value={content}
        onChange={(event) => setContent(event.currentTarget.value)}
      />
      <Text fw={"500"}>Rate Us</Text>
      <Rating
        value={rating}
        onChange={setRating}
        size="lg"
        fractions={2}
        mb={"sm"}
      />
      <Button size="md" sx={{ float: "right" }} onClick={handleSubmit}>
        {isLoading ? (
          <Loader size={"sm"} color="dark" variant="bars" />
        ) : (
          <Text>Submit</Text>
        )}
      </Button>
    </Card>
  );
};

const CommentList: React.FC<{
  comments: Comment[] | undefined;
  user: UserResource | null | undefined;
}> = ({ comments, user }) => {
  if (!comments) return null;

  const ctx = api.useContext();
  const { mutate: removeCommentMutation, isLoading } =
    api.comment.remove.useMutation({
      async onSuccess() {
        await ctx.comment.getAll.invalidate();
      },
    });

  return (
    <Stack>
      {comments.map((comment) => (
        <Card key={comment.id} shadow="sm" padding="lg" radius="md" withBorder>
          <Group position="apart">
            <Group spacing={"xs"}>
              <Text>@{comment.username}</Text>
              <Text opacity={0.7}>·</Text>
              <Text size={"sm"}>
                <Text opacity={0.7}>{comment.createdAt.toDateString()}</Text>
              </Text>
            </Group>
            {user?.id === comment.userId && (
              <ActionIcon
                onClick={() => removeCommentMutation({ commentId: comment.id })}
                disabled={isLoading}
              >
                <IconX opacity={0.7} />
              </ActionIcon>
            )}
          </Group>
          <Text mb={rem(2.5)} size={"lg"}>
            {comment.content}
          </Text>
          <Rating value={comment.rating} fractions={2} readOnly />
        </Card>
      ))}
    </Stack>
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
