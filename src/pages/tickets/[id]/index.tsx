import { clerkClient } from "@clerk/nextjs";
import {
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Image,
  LoadingOverlay,
  Stack,
  Text,
  rem,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { GetServerSidePropsContext, NextPage } from "next";
import { env } from "~/env.mjs";
import type { IMovie } from "~/types";
import { api } from "~/utils/api";
import { useState } from "react";
import type { User } from "@clerk/nextjs/dist/types/server";
import { prisma } from "~/server/db";
import TicketPDF from "~/componens/TicketPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { getURL } from "~/lib/helpers";
import QRCode from "qrcode";

// hours converter helper
const toHoursAndMinutes = (totalMinutes: number | undefined) => {
  if (!totalMinutes) return null;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};

const fetchMovie = async (id: string) => {
  const { data } = await axios.get<IMovie>(
    `${env.NEXT_PUBLIC_TMDB_BASE_URL}/movie/${id}?api_key=${env.NEXT_PUBLIC_TMDB_API_KEY}`
  );
  return data;
};

const TicketPage: NextPage<{ id: string; user: User | null | undefined }> = ({
  id,
  user,
}) => {
  const [src, setSrc] = useState<string>("");
  const tmdbImagePath = "https://image.tmdb.org/t/p/original";
  const { data: ticket, isLoading: loadingTicket } =
    api.ticket.getById.useQuery(
      {
        ticketId: id,
      },
      {
        async onSuccess(data) {
          const srcString = await QRCode.toDataURL(
            `${getURL()}/ticket/${data?.id ?? ""}`
          );
          setSrc(srcString);
        },
      }
    );

  const { data: movieDetais, isLoading: loadingMovieDetails } = useQuery({
    queryKey: ["movie", ticket?.movie.imdbId],
    queryFn: () => fetchMovie(ticket?.movie.imdbId ?? ""),
    enabled: !!ticket?.movie.imdbId,
  });

  if (loadingTicket || loadingMovieDetails) return <LoadingOverlay visible />;

  return (
    <main>
      <Card
        mx={"auto"}
        w={"55%"}
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        sx={{
          "@media (max-width: 40em)": {
            width: "90%",
          },
        }}
      >
        <Card.Section>
          <Image
            src={`${tmdbImagePath}${movieDetais?.backdrop_path ?? ""}`}
            height={160}
            alt="Movie Image"
          />
        </Card.Section>
        <Group position="apart" mt="md" mb="xs">
          <Group spacing={"xs"}>
            <Text weight={500}>{movieDetais?.title}</Text>
            <Badge tt={"uppercase"}>{movieDetais?.original_language}</Badge>
          </Group>
          <Badge color="pink" variant="light">
            {toHoursAndMinutes(movieDetais?.runtime)}
          </Badge>
        </Group>
        <Divider mb={rem(10)} />
        <Card.Section px={"sm"}>
          <Stack>
            <Group position="apart" noWrap>
              <Text tt={"uppercase"} weight={500}>
                location
              </Text>
              <Text ta={"end"}>
                2823 Nottingham Way, Albany, GA 31707, United States
              </Text>
            </Group>
            <Group position="apart" noWrap>
              <Text tt={"uppercase"} weight={500}>
                room
              </Text>
              <Text>{ticket?.room.name.replace("_", " ").toUpperCase()}</Text>
            </Group>
            <Group position="apart" noWrap>
              <Text tt={"uppercase"} weight={500}>
                date
              </Text>
              <Text>{ticket?.date.toDateString()}</Text>
            </Group>
            <Group position="apart" noWrap>
              <Text tt={"uppercase"} weight={500}>
                showtime
              </Text>

              <Text>{ticket?.showtime.toUpperCase()}</Text>
            </Group>
            <Group position="apart" noWrap>
              <Text tt={"uppercase"} weight={500}>
                bundle
              </Text>
              <Text>
                {ticket?.bundle ? ticket.bundle.toUpperCase() : "NO BUNDLE"}
              </Text>
            </Group>
            <Group position="apart" noWrap>
              <Text tt={"uppercase"} weight={500}>
                seats
              </Text>
              <Text>
                {ticket?.seats
                  .map((seat) => `${seat.row}${seat.column}`)
                  .join(", ")}
              </Text>
            </Group>
            <Group position="apart" noWrap>
              <Text tt={"uppercase"} weight={500}>
                client
              </Text>
              <Text>
                {user?.firstName} {user?.lastName}
              </Text>
            </Group>
          </Stack>
        </Card.Section>
        {ticket && movieDetais && (
          <PDFDownloadLink
            document={
              <TicketPDF
                ticket={ticket}
                QRSource={src}
                username={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
                movie={movieDetais}
              />
            }
            fileName={`Ticket_${ticket?.id ?? ""}`}
          >
            {({ loading }) =>
              loading ? (
                <Button
                  variant="light"
                  color="indigo"
                  fullWidth
                  mt="md"
                  radius="md"
                >
                  Loading Document
                </Button>
              ) : (
                <Button
                  variant="light"
                  color="indigo"
                  fullWidth
                  mt="md"
                  radius="md"
                >
                  Download Ticket
                </Button>
              )
            }
          </PDFDownloadLink>
        )}
      </Card>
    </main>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ id: string }>
) => {
  const id = context.params?.id;
  const ticket = await prisma.ticket.findUnique({
    where: {
      id,
    },
  });
  const user = await clerkClient.users.getUser(ticket?.userId ?? "");
  const userString = JSON.stringify(user);
  const parsedUser: User = JSON.parse(userString);
  return {
    props: {
      id,
      user: parsedUser,
    },
  };
};

export default TicketPage;
