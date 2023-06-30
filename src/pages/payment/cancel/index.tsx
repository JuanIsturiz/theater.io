import {
  Button,
  Card,
  Center,
  Loader,
  LoadingOverlay,
  Stack,
  Title,
  rem,
} from "@mantine/core";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useState, useEffect } from "react";
import Link from "next/link";

const CancelPage: NextPage = () => {
  const { query } = useRouter();
  const ticketId = query.ticket_id as string;
  const [message, setMessage] = useState<string>("");

  const { mutate: cancelPaymentMutation, isLoading } =
    api.payment.cancelPayment.useMutation({
      onSuccess() {
        setMessage("Ticket cancelled successfully!");
      },
      onError() {
        setMessage("Invalid ticket provided");
      },
    });

  useEffect(() => {
    if (!ticketId) {
      console.log("missing credentials!");
      return;
    }
    console.log("canceling!");
    cancelPaymentMutation({
      ticketId,
    });
  }, [ticketId, cancelPaymentMutation]);

  if (!message && !isLoading) return <LoadingOverlay visible />;

  return (
    <main>
      <Center my={rem(96)}>
        {isLoading && (
          <Card>
            <Stack align="center">
              <Title order={2}>Canceling ticket...</Title>
              <Loader size={"md"} />
            </Stack>
          </Card>
        )}
        {!isLoading && message && (
          <Card>
            <Stack align="center">
              <Title order={2}>{message}</Title>
              <Link href={"/reserve"}>
                <Button>Go to reserve</Button>
              </Link>
            </Stack>
          </Card>
        )}
      </Center>
    </main>
  );
};

export default CancelPage;
