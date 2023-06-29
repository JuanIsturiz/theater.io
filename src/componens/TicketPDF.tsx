import type { UserResource } from "@clerk/types";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { IMovie } from "~/types";
import type { RouterOutputs } from "~/utils/api";

type Ticket = RouterOutputs["ticket"]["getByUserId"][number];

interface TicketPDFProps {
  ticket: Ticket | null;
  QRSource: string;
  user: UserResource | null | undefined;
  movie: IMovie;
}

const mantineBlue = "#1C7ED6";

const styles = StyleSheet.create({
  blueLineFat: {
    height: 8,
    width: "100%",
    backgroundColor: mantineBlue,
  },
  blueLineThin: {
    height: 2,
    width: "100%",
    backgroundColor: mantineBlue,
  },
  infoContainer: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  infoLabels: { color: "#888" },
  qr: {
    width: 150,
    height: 150,
  },
});

const TicketPDF: React.FC<TicketPDFProps> = ({
  ticket,
  QRSource,
  user,
  movie,
}) => {
  const tmdbImagePath = "https://image.tmdb.org/t/p/original";

  return (
    <Document>
      <Page>
        <View style={[styles.blueLineFat, { marginBottom: 8 }]}></View>
        <View style={{ textAlign: "center" }}>
          <Text style={{ color: mantineBlue, fontSize: 20, marginBottom: 2 }}>
            Hello, {user?.firstName} {user?.lastName}
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 24 }}>
            Thank you for choosing theater.io
          </Text>
        </View>
        <View style={[styles.blueLineThin, { marginBottom: 24 }]}></View>
        <Text style={{ fontSize: 16, marginBottom: 12, textAlign: "center" }}>
          Ticket Purchase Details
        </Text>
        <View
          style={[styles.infoContainer, { flex: "0 0 250px", fontSize: 12 }]}
        >
          <View>
            <Image
              style={{ width: 175 }}
              src={tmdbImagePath + movie.poster_path}
            />
          </View>
          <View style={{ paddingVertical: 4 }}>
            <Text style={{ fontFamily: "Helvetica-Bold", marginBottom: 6 }}>
              Ticket ID:{" "}
              <Text style={{ fontFamily: "Helvetica" }}>{ticket?.id}</Text>
            </Text>
            <Text style={{ fontFamily: "Helvetica-Bold", marginBottom: 2 }}>
              Purchased at:
            </Text>
            <Text style={{ marginBottom: 2 }}>
              {ticket?.createdAt.toLocaleDateString().replaceAll("/", "-")}
            </Text>
            <Text style={{ marginBottom: 6 }}>
              {ticket?.createdAt.toLocaleTimeString()}
            </Text>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>QR Code:</Text>
            <View style={{ marginHorizontal: "auto" }}>
              <Image style={styles.qr} src={QRSource} />
            </View>
          </View>
        </View>
        <Text style={{ fontSize: 22, textAlign: "center" }}>{movie.title}</Text>
        <Text
          style={{
            fontSize: 12,
            color: "#444",
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          {movie.original_language.toUpperCase()}
        </Text>
        <View
          style={[styles.infoContainer, { flex: "0 0 auto", fontSize: 12 }]}
        >
          <View
            style={{
              flex: "0 0 auto",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 6,
            }}
          >
            <Text style={styles.infoLabels}>Location</Text>
            <Text style={styles.infoLabels}>Room</Text>
            <Text style={styles.infoLabels}>Date</Text>
            <Text style={styles.infoLabels}>Showtime</Text>
            <Text style={styles.infoLabels}>Seats</Text>
            <Text style={styles.infoLabels}>Client</Text>
          </View>
          <View
            style={{
              flex: "0 0 auto",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 6,
            }}
          >
            <Text>2823 Nottingham Way, Albany, GA 31707, United States</Text>
            <Text>{ticket?.room?.name?.replace("_", " ").toUpperCase()}</Text>
            <Text>{ticket?.date.toDateString()}</Text>
            <Text>{ticket?.showtime.toUpperCase()}</Text>
            <Text>
              {ticket?.seats
                .map((seat) => `${seat.row}${seat.column}`)
                .join(", ")}
            </Text>
            <Text>
              {user?.firstName} {user?.lastName}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default TicketPDF;
