import type { UserResource } from "@clerk/types";
import { useUser } from "@clerk/nextjs";
import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Center,
  Group,
  Loader,
  LoadingOverlay,
  MediaQuery,
  Modal,
  Table,
  Text,
  Title,
  rem,
} from "@mantine/core";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { IconDownload, IconTicketOff, IconTrash } from "@tabler/icons-react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import TicketPDF from "~/componens/TicketPDF";
import { type RouterOutputs, api } from "~/utils/api";
import QRCode from "qrcode";
import { getURL } from "~/lib/helpers";
import { useState, useEffect } from "react";
import axios from "axios";
import type { IMovie } from "~/types";
import { env } from "~/env.mjs";
import { useQuery } from "@tanstack/react-query";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";

type Ticket = RouterOutputs["ticket"]["getByUserId"][number];

const Tickets: NextPage = () => {
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    if (user.isLoaded && !user.user) {
      void router.replace("/");
    }
  }, [user.isLoaded, user.user, router]);

  const { data: tickets, isLoading } = api.ticket.getByUserId.useQuery(
    { userId: user.user?.id ?? "" },
    {
      enabled: !!user.user,
    }
  );

  if (isLoading) return <LoadingOverlay visible />;

  return (
    <main>
      <Title align="center" weight={"normal"}>
        Tickets
      </Title>
      <Text align="center" mb={"1rem"} opacity={0.6}>
        User tickets listed below
      </Text>
      {!tickets?.length && (
        <Box sx={{ textAlign: "center" }}>
          <Center mb={".25rem"}>
            <Title weight={"normal"} mr={".25rem"}>
              No tickets found
            </Title>
            <IconTicketOff size={"1.75rem"} />
          </Center>
          <Text opacity={0.7}>
            Create a new ticket{" "}
            <Anchor onClick={() => void router.replace("reserve")}>here</Anchor>
          </Text>
        </Box>
      )}
      {tickets?.length && <TicketTable tickets={tickets} user={user.user} />}
    </main>
  );
};

const TicketTable: React.FC<{
  tickets: Ticket[];
  user: UserResource | null | undefined;
}> = ({ tickets, user }) => {
  return (
    <Table fontSize={"sm"} striped highlightOnHover>
      <thead>
        <tr>
          <th>Ticket ID</th>
          <th>Movie</th>
          <th>Date</th>
          <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
            <th>Showtime</th>
          </MediaQuery>
          <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
            <th>Seats</th>
          </MediaQuery>
          <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
            <th>Bundle</th>
          </MediaQuery>
          <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
            <th>Created At</th>
          </MediaQuery>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((t) => (
          <TicketRow key={t.id} ticket={t} user={user} />
        ))}
      </tbody>
    </Table>
  );
};

const fetchMovie = async (id: string) => {
  const { data } = await axios.get<IMovie>(
    `${env.NEXT_PUBLIC_TMDB_BASE_URL}/movie/${id}`,
    {
      params: {
        api_key: env.NEXT_PUBLIC_TMDB_API_KEY,
      },
    }
  );
  return data;
};

const TicketRow: React.FC<{
  ticket: Ticket;
  user: UserResource | null | undefined;
}> = ({ ticket, user }) => {
  const [src, setSrc] = useState<string>("");
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    if (!ticket) return;
    const setQRString = async () => {
      const srcString = await QRCode.toDataURL(
        `${getURL()}/ticket/${ticket.id}`
      );
      setSrc(srcString);
    };
    setQRString()
      .then(() => {
        console.log("QRCode Generated Successfully!");
      })
      .catch(() => {
        console.log("Error Generating QRCode!");
      });
  }, [ticket]);

  const { data: movie } = useQuery<IMovie>({
    queryKey: ["movie", ticket.movie.imdbId],
    queryFn: () => fetchMovie(ticket.movie.imdbId),
    enabled: !!ticket.movie.imdbId,
  });

  const ctx = api.useContext();
  const { mutate: deleteTicketMutation, isLoading } =
    api.payment.cancelPayment.useMutation({
      async onSuccess() {
        close();
        await ctx.ticket.getByUserId.invalidate({ userId: user?.id ?? "" });
      },
      onError() {
        close();
      },
    });

  const handleDelete = () => {
    open();
  };

  const handleDeleteTicket = () => {
    deleteTicketMutation({ ticketId: ticket.id });
  };

  return (
    <tr>
      <Modal
        opened={opened}
        onClose={close}
        title="Warning!"
        transitionProps={{ transition: "rotate-left" }}
      >
        <Text mb={rem(10)}>Are you sure you want to delete this ticket?</Text>
        <Group position="right">
          <Button color="red" onClick={handleDeleteTicket} disabled={isLoading}>
            Delete
          </Button>
          <Button color="dark" onClick={close}>
            Cancel
          </Button>
        </Group>
      </Modal>
      <td>
        <Link href={`tickets/${ticket.id}`}>
          <Text
            sx={{
              ":hover": {
                cursor: "pointer",
                textDecoration: "underline",
              },
            }}
          >
            {ticket.id}
          </Text>
        </Link>
      </td>
      <td>{ticket.movie.name}</td>
      <td>{ticket.date.toLocaleDateString()}</td>
      <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
        <td>{ticket.showtime.toUpperCase()}</td>
      </MediaQuery>
      <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
        <td>
          {ticket.seats
            .map((s) => `${s.row}${s.column}`.toUpperCase())
            .join(" - ")}
        </td>
      </MediaQuery>
      <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
        <td>{ticket.bundle ? ticket.bundle : "NO BUNDLE"}</td>
      </MediaQuery>
      <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
        <td>{ticket.createdAt.toLocaleDateString()}</td>
      </MediaQuery>
      <td>
        {movie && (
          <PDFDownloadLink
            document={
              <TicketPDF
                ticket={ticket}
                QRSource={src}
                username={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
                movie={movie}
              />
            }
            fileName={`Ticket_${ticket.id ?? ""}`}
          >
            {({ loading }) =>
              loading ? (
                <Loader />
              ) : (
                <ActionIcon>
                  <IconDownload />
                </ActionIcon>
              )
            }
          </PDFDownloadLink>
        )}
      </td>
      <td>
        <ActionIcon onClick={handleDelete}>
          <IconTrash />
        </ActionIcon>
      </td>
    </tr>
  );
};

export default Tickets;
