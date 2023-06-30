import type { UserResource } from "@clerk/types";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import type { IMovie } from "~/types";
import type { RouterOutputs } from "~/utils/api";

type Ticket = RouterOutputs["ticket"]["getByUserId"][number];

interface TicketPDFProps {
  ticket: Ticket | null;
  QRSource: string;
  user: UserResource | null | undefined;
  movie: IMovie;
}

// hours converter helper
const toHoursAndMinutes = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};

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
  grayLineThin: {
    height: 1,
    width: "80%",
    marginVertical: 6,
    marginHorizontal: "auto",
    backgroundColor: "#888",
  },
  infoContainer: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  infoLabels: { color: "#999", textTransform: "uppercase" },
  qr: {
    width: 150,
    height: 150,
  },
});

const getBundlePrice = (bundle: "BASIC" | "PREMIUM" | "VIP" | null) => {
  if (!bundle) return 0;
  else if (bundle === "BASIC") return 5;
  else if (bundle === "PREMIUM") return 10;
  else if (bundle === "VIP") return 15;
  else return 0;
};

const TicketPDF: React.FC<TicketPDFProps> = ({
  ticket,
  QRSource,
  user,
  movie,
}) => {
  const tmdbImagePath = "https://image.tmdb.org/t/p/original";
  if (!ticket)
    return (
      <Document>
        <Page>
          <Text>Error generating ticket</Text>
        </Page>
      </Document>
    );

  const bundlePrice = getBundlePrice(ticket.bundle);
  return (
    <Document>
      <Page>
        <View style={[styles.blueLineFat, { marginBottom: 8 }]}></View>
        <View style={{ textAlign: "center" }}>
          <Text style={{ color: mantineBlue, fontSize: 24, marginBottom: 2 }}>
            Hello, {user?.firstName} {user?.lastName}
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 24 }}>
            Thank you for choosing theater.io
          </Text>
        </View>
        <View style={[styles.blueLineThin, { marginBottom: 24 }]}></View>
        <Text style={{ fontSize: 20, marginBottom: 12, textAlign: "center" }}>
          Ticket Purchase Details
        </Text>
        <View
          style={[styles.infoContainer, { flex: "0 0 250px", fontSize: 16 }]}
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
              <Text style={{ fontFamily: "Helvetica" }}>{ticket.id}</Text>
            </Text>
            <Text style={{ fontFamily: "Helvetica-Bold", marginBottom: 2 }}>
              Purchased at:
            </Text>
            <Text style={{ marginBottom: 2 }}>
              {ticket.createdAt.toLocaleDateString().replaceAll("/", "-")}
            </Text>
            <Text style={{ marginBottom: 6 }}>
              {ticket.createdAt.toLocaleTimeString()}
            </Text>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>QR Code:</Text>
            <View style={{ marginHorizontal: "auto" }}>
              <Image style={styles.qr} src={QRSource} />
            </View>
          </View>
        </View>
        <View style={styles.grayLineThin}></View>
        <Text style={{ fontSize: 26, textAlign: "center" }}>{movie.title}</Text>
        <Text
          style={{
            fontSize: 16,
            textAlign: "center",
          }}
        >
          {toHoursAndMinutes(movie.runtime)}
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: "#444",
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          {movie.original_language.toUpperCase()}
        </Text>
        <View
          style={[styles.infoContainer, { flex: "0 0 170px", fontSize: 16 }]}
        >
          <View
            style={{
              flex: "0 0 auto",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 8,
            }}
          >
            <Text style={styles.infoLabels}>location</Text>
            <Text style={styles.infoLabels}>room</Text>
            <Text style={styles.infoLabels}>date</Text>
            <Text style={styles.infoLabels}>showtime</Text>
            <Text style={styles.infoLabels}>bundle</Text>
            <Text style={styles.infoLabels}>seats</Text>
            <Text style={styles.infoLabels}>client</Text>
          </View>
          <View
            style={{
              flex: "0 0 auto",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 8,
            }}
          >
            <Text>2823 Nottingham Way, Albany, GA 31707, United States</Text>
            <Text>{ticket.room.name.replace("_", " ").toUpperCase()}</Text>
            <Text>{ticket.date.toDateString()}</Text>
            <Text>{ticket.showtime.toUpperCase()}</Text>
            <Text>
              {ticket.bundle ? ticket.bundle.toUpperCase() : "NO BUNDLE"}
            </Text>
            <Text>
              {ticket.seats
                .map((seat) => `${seat.row}${seat.column}`)
                .join(", ")}
            </Text>
            <Text>
              {user?.firstName} {user?.lastName}
            </Text>
          </View>
        </View>
        <View style={styles.grayLineThin}></View>
        <View>
          <Text style={{ fontSize: 20, marginLeft: 72, marginBottom: 10 }}>
            Payment Summary
          </Text>
          <View style={{ fontSize: 16, marginLeft: 86 }}>
            <Text style={{ marginBottom: 6 }}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>Ticket: </Text>
              {ticket.seats.length} seats; $
              {(ticket.seats.length * 4).toFixed(2)}
            </Text>
            <Text style={{ marginBottom: 6 }}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>Bundle: </Text>
              <Text>
                {ticket.bundle ? ticket.bundle.toUpperCase() : "NO BUNDLE"}; $
                {bundlePrice.toFixed(2)}
              </Text>
            </Text>
            <Text style={{ color: mantineBlue, marginBottom: 6 }}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>
                Ticket Total:{" "}
              </Text>
              ${(ticket.seats.length * 4 + bundlePrice).toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={styles.grayLineThin}></View>
        <Text style={{ fontSize: 14, textAlign: "center", marginBottom: 1 }}>
          Enjoy your movie!
        </Text>
        <Text style={{ fontSize: 14, textAlign: "center" }}>
          Come back soon, theater.io team
        </Text>
      </Page>
    </Document>
  );
};

export default TicketPDF;
