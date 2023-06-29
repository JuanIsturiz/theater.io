import {
  Box,
  Button,
  Card,
  Center,
  Divider,
  Group,
  Image,
  Loader,
  LoadingOverlay,
  Stack,
  Text,
  Title,
  rem,
} from "@mantine/core";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { type RouterOutputs, api } from "~/utils/api";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { getURL } from "~/lib/helpers";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import TicketPDF from "~/componens/TicketPDF";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import type { IMovie } from "~/types";
import { env } from "~/env.mjs";
import { useQuery } from "@tanstack/react-query";

type Ticket = RouterOutputs["ticket"]["getByUserId"][number];

// hours converter helper
const toHoursAndMinutes = (totalMinutes: number) => {
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

const SuccessPage: NextPage = () => {
  const user = useUser();
  const { query } = useRouter();
  const sessionId = query.session_id as string;
  const ticketId = query.ticket_id as string;
  const [src, setSrc] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [pdfTicket, setPdfTicket] = useState<Ticket | null>(null);

  const { mutate: confirmPaymentMutation, isLoading } =
    api.payment.confirmPayment.useMutation({
      onSuccess(data) {
        if (data.status === "verified") {
          QRCode.toDataURL(`${getURL()}/ticket/${data.ticket}`).then(setSrc);
          setMessage("Ticket verified successfully!");
          setPdfTicket(data.ticket);
          return;
        }
        if (data.status === "already verified") {
          QRCode.toDataURL(`${getURL()}/ticket/${ticketId}`).then(setSrc);
          setMessage("Ticket already verified!");
          setPdfTicket(data.ticket);
          return;
        }
      },
    });

  const { data: movie } = useQuery<IMovie>({
    queryKey: ["movie"],
    queryFn: () => fetchMovie(pdfTicket?.movie.imdbId ?? ""),
    enabled: !!pdfTicket?.movie.imdbId,
  });

  useEffect(() => {
    if (!sessionId || !ticketId) {
      console.log("missing credentials!");
      return;
    }
    console.log("validating!");
    confirmPaymentMutation({
      sessionId,
      ticketId,
    });
  }, [sessionId, ticketId]);

  if ((!message && !isLoading) || !movie) return <LoadingOverlay visible />;

  return (
    <main>
      <Center my={rem(96)}>
        {isLoading && (
          <Card>
            <Stack align="center">
              <Title order={2}>Validating payment...</Title>
              <Loader size={"md"} />
            </Stack>
          </Card>
        )}
        {!isLoading && message && (
          <Card>
            <Stack align="center">
              <Title order={2}>{message}</Title>
              {/* {src && <Image src={src} />} */}
              <PDFDownloadLink
                document={
                  <TicketPDF
                    ticket={pdfTicket}
                    QRSource={src}
                    user={user.user}
                    movie={movie}
                  />
                }
                fileName={`Ticket_${pdfTicket?.id ?? ""}`}
              >
                {({ loading }) =>
                  loading ? (
                    <Button color="dark">Loadind Document</Button>
                  ) : (
                    <Button color="dark">Download Ticket</Button>
                  )
                }
              </PDFDownloadLink>
              <Group>
                <Divider w={rem(100)} />
                <Text>OR</Text>
                <Divider w={rem(100)} />
              </Group>
              <Button>Go to tickets</Button>
            </Stack>
          </Card>
        )}
      </Center>
    </main>
  );
};

export default SuccessPage;
