import { Anchor, Box, Center, Table, Text, Title } from "@mantine/core";
import { IconTicketOff } from "@tabler/icons-react";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

const Tickets: NextPage = () => {
  const router = useRouter();
  const tickets: ITicket[] = [
    {
      id: "01",
      date: new Date(1686715200000),
      showtime: "6:30PM",
      seats: ["B6", "B7"],
      bundle: Bundle.PREMIUM,
      createdAt: new Date(),
    },
    {
      id: "02",
      date: new Date(1686888000000),
      showtime: "9:00PM",
      seats: ["D2", "D3"],
      bundle: Bundle.VIP,
      createdAt: new Date(),
    },
    {
      id: "03",
      date: new Date(1686974400000),
      showtime: "4:00PM",
      seats: ["B6"],
      bundle: Bundle.BASIC,
      createdAt: new Date(),
    },
  ];

  return (
    <main>
      <Title align="center" weight={"normal"}>
        Tickets
      </Title>
      <Text align="center" mb={"1rem"} opacity={0.6}>
        User tickets listed below
      </Text>
      {!tickets.length && (
        <Box sx={{ textAlign: "center" }}>
          <Center mb={".25rem"}>
            <Title weight={"normal"} mr={".25rem"}>
              No tickets found
            </Title>
            <IconTicketOff size={"1.75rem"} />
          </Center>
          <Text opacity={0.7}>
            Create a new ticket{" "}
            <Anchor onClick={() => router.replace("reserve")}>here</Anchor>
          </Text>
        </Box>
      )}
      {tickets.length && <TicketTable tickets={tickets} />}
    </main>
  );
};

interface ITicket {
  id: string;
  date: Date;
  showtime: string;
  seats: Array<string>;
  bundle: Bundle;
  createdAt: Date;
}

enum Bundle {
  BASIC = "BASIC",
  PREMIUM = "PREMIUM",
  VIP = "VIP",
}

const TicketTable: React.FC<{ tickets: ITicket[] }> = ({ tickets }) => {
  const rows = tickets.map((ticket) => (
    <tr key={ticket.id}>
      <td>{ticket.id}</td>
      <td>{ticket.date.toDateString()}</td>
      <td>{ticket.showtime}</td>
      <td>{ticket.seats.join(" - ")}</td>
      <td>{ticket.bundle}</td>
      <td>{ticket.createdAt.toDateString()}</td>
    </tr>
  ));
  return (
    <Table horizontalSpacing={"xl"} fontSize={"lg"} striped highlightOnHover>
      <thead>
        <tr>
          <th>Ticket ID</th>
          <th>Date</th>
          <th>Showtime</th>
          <th>Seats</th>
          <th>Bundle</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};
export default Tickets;
