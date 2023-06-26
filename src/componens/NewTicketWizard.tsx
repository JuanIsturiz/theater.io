import { useEffect, useState } from "react";
import {
  Modal,
  Stepper,
  Button,
  Group,
  Box,
  Radio,
  Flex,
  Text,
  ActionIcon,
  SimpleGrid,
  Center,
  NumberInput,
  Card,
  Title,
  Divider,
  rem,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { IconArmchair, IconMovie } from "@tabler/icons-react";
import { type RouterOutputs, api } from "~/utils/api";

type Screen = RouterOutputs["screen"]["getAll"][number];
type Seat = RouterOutputs["seat"]["getByScreen"][number];

interface SeatByGroup extends Seat {
  group: string;
}

interface NewTicketWizardProps {
  movie:
    | {
        title: string;
        id: string;
        screens: Screen[];
      }
    | null
    | undefined;
  disclosure: readonly [
    boolean,
    {
      readonly open: () => void;
      readonly close: () => void;
      readonly toggle: () => void;
    }
  ];
}

interface Room {
  left: Array<SeatByGroup>;
  center: Array<SeatByGroup>;
  right: Array<SeatByGroup>;
}

const placeSeats = (seats: Seat[]) => {
  const room: Room = {
    left: [],
    center: [],
    right: [],
  };
  seats.forEach((seat) => {
    if (seat.column < 5) {
      room.left.push({ ...seat, group: "left" });
    } else if (seat.column > 4 && seat.column < 9) {
      room.center.push({ ...seat, group: "center" });
    } else {
      room.right.push({ ...seat, group: "right" });
    }
  });
  return room;
};

//todo add animations and unavailable seats feedback
//todo add stripe stuff

const NewTicketWizard: React.FC<NewTicketWizardProps> = ({
  movie,
  disclosure,
}) => {
  const [opened, { close }] = disclosure;

  // testing variables
  const availableDates = movie?.screens?.map((screen) => screen.date);

  // mantine
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  // ticket values
  const [datetime, setDatetime] = useState<Date | null>(null);
  const screensByDate = movie?.screens.filter(
    (screen) => screen.date.getTime() === datetime?.getTime() && !screen.isFull
  );
  const [showtime, setShowtime] = useState<string | null>(null);
  const [bundle, setBundle] = useState<string | null>(null);
  const [screen, setScreen] = useState<Screen | undefined>();
  const [seatQuantity, setSeatQuantity] = useState<number | "">();
  const [selectedSeats, setSelectedSeats] = useState<Array<SeatByGroup>>([]);

  const handleClose = () => {
    setShowtime(null);
    setDatetime(null);
    setSeatQuantity("");
    setSelectedSeats([]);
    setScreen(undefined);
    setBundle(null);
    setActive(0);
    close();
  };

  const {
    data: seats,
    // isLoading
  } = api.seat.getByScreen.useQuery(
    { screenId: screen?.id ?? "" },
    {
      enabled: !!screen?.id,
    }
  );

  const availableSeats = seats?.filter((seat) => !seat.userId).length || 0;
  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={movie?.title || "Movie Ticket"}
      size={"xl"}
    >
      <Stepper
        active={active}
        onStepClick={setActive}
        breakpoint="sm"
        allowNextStepsSelect={false}
      >
        {/* Date and Showtime */}
        <Stepper.Step label="Schedule" description="Select date and time">
          <Flex justify={"space-evenly"} gap={"xl"} align={"center"}>
            <Box sx={{ textAlign: "center" }}>
              <Text weight={"500"} size={"sm"}>
                Select the function date
              </Text>
              <Group>
                <DatePicker
                  value={datetime}
                  onChange={setDatetime}
                  excludeDate={(date) => {
                    return !availableDates?.some(
                      (avDate) => avDate.getTime() === date.getTime()
                    );
                  }}
                />
              </Group>
            </Box>
            <Box>
              <Box sx={{ textAlign: "center" }} mb={"xl"}>
                {datetime && (
                  <Radio.Group
                    value={showtime || ""}
                    onChange={setShowtime}
                    name="showtime"
                    label="Select your desired showtime"
                    description="Only available option will be on display"
                  >
                    <Flex gap={"sm"} mt={"sm"}>
                      {Array.from(
                        new Set(screensByDate?.map((screen) => screen.showtime))
                      )
                        .sort((a, b) => Number(a[0]) - Number(b[0]))
                        .map((showtime, idx) => (
                          <Radio
                            key={idx}
                            value={showtime}
                            label={showtime}
                            onClick={() => {
                              setScreen(
                                screensByDate?.find(
                                  (screen) => screen.showtime === showtime
                                )
                              );
                            }}
                          />
                        ))}
                    </Flex>
                  </Radio.Group>
                )}
              </Box>
              <NumberInput
                value={seatQuantity}
                onChange={setSeatQuantity}
                mb={rem(2.5)}
                label="Number of seats"
                description={`From 0 to ${
                  availableSeats < 4 ? availableSeats : 4
                }`}
                placeholder="2 Seats"
                max={availableSeats < 4 ? availableSeats : 4}
                min={1}
              />
              {seats && (
                <Text size={"sm"} opacity={0.6}>
                  Available seats: {availableSeats}
                </Text>
              )}
            </Box>
          </Flex>
        </Stepper.Step>
        {/* Seats */}
        <Stepper.Step label="Seats" description="Seats location and quantity">
          {seats && (
            <SeatPicker
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              room={placeSeats(seats)}
              seatQuantity={seatQuantity || 0}
            />
          )}
        </Stepper.Step>
        {/* Bundle */}
        <Stepper.Step label="Bundle" description="Choose bundle">
          <SimpleGrid cols={3} mt={"1rem"}>
            <Card
              p="xl"
              sx={{ textAlign: "center", overflow: "visible" }}
              opacity={bundle === "BASIC" ? 0.7 : 1}
            >
              <Box
                pos={"relative"}
                mt={"-3rem"}
                sx={{
                  zIndex: 50,
                }}
              >
                <IconMovie size={"3rem"} />
              </Box>
              <Card.Section mb={".5rem"}>
                <Text weight={500} size={"1.5rem"}>
                  Basic
                </Text>
                <Text weight={500} size={"1.5rem"} opacity={0.8}>
                  $5
                </Text>
              </Card.Section>
              <Card.Section mb={"1rem"}>
                <Divider />
                <Text py={".25rem"}>Medium Popcorns</Text>
                <Divider />
                <Text py={".25rem"}>Medium Drink</Text>
                <Divider />
                <Text py={".25rem"}>Chocolate MD</Text>
                <Divider />
                <Text py={".25rem"}>No Food</Text>
                <Divider />
                <Text py={".25rem"}>Pick Up</Text>
                <Divider />
              </Card.Section>
              <Card.Section>
                <Button
                  tt={"uppercase"}
                  onClick={() => {
                    if (bundle === "BASIC") {
                      setBundle(null);
                    } else {
                      setBundle("BASIC");
                    }
                  }}
                >
                  {bundle === "BASIC" ? "selected" : "select"}
                </Button>
              </Card.Section>
            </Card>
            <Card
              p="xl"
              sx={{ textAlign: "center", overflow: "visible" }}
              opacity={bundle === "PREMIUM" ? 0.7 : 1}
            >
              <Box
                pos={"relative"}
                mt={"-3rem"}
                sx={{
                  zIndex: 50,
                }}
              >
                <IconMovie size={"3rem"} />
              </Box>
              <Card.Section mb={".5rem"}>
                <Text weight={500} size={"1.5rem"}>
                  Premium
                </Text>
                <Text weight={500} size={"1.5rem"} opacity={0.8}>
                  $10
                </Text>
              </Card.Section>
              <Card.Section mb={"1rem"}>
                <Divider />
                <Text py={".25rem"}>2 Large Popcorns</Text>
                <Divider />
                <Text py={".25rem"}>2 Large Drinks</Text>
                <Divider />
                <Text py={".25rem"}>Chocolate XL</Text>
                <Divider />
                <Text py={".25rem"}>No Food</Text>
                <Divider />
                <Text py={".25rem"}>Pick Up</Text>
                <Divider />
              </Card.Section>
              <Card.Section>
                <Button
                  tt={"uppercase"}
                  color="dark"
                  onClick={() => {
                    if (bundle === "PREMIUM") {
                      setBundle(null);
                    } else {
                      setBundle("PREMIUM");
                    }
                  }}
                >
                  {bundle === "PREMIUM" ? "selected" : "select"}
                </Button>
              </Card.Section>
            </Card>{" "}
            <Card
              p="xl"
              sx={{ textAlign: "center", overflow: "visible" }}
              opacity={bundle === "VIP" ? 0.7 : 1}
            >
              <Box
                pos={"relative"}
                mt={"-3rem"}
                sx={{
                  zIndex: 50,
                }}
              >
                <IconMovie size={"3rem"} />
              </Box>
              <Card.Section mb={".5rem"}>
                <Text weight={500} size={"1.5rem"}>
                  VIP
                </Text>
                <Text weight={500} size={"1.5rem"} opacity={0.8}>
                  $25
                </Text>
              </Card.Section>
              <Card.Section mb={"1rem"}>
                <Divider />
                <Text py={".25rem"}>3 Large Popcorns</Text>
                <Divider />
                <Text py={".25rem"}>3 Large Drinks</Text>
                <Divider />
                <Text py={".25rem"}>Chocolate XL</Text>
                <Divider />
                <Text py={".25rem"}>2 Hamburgers</Text>
                <Divider />
                <Text py={".25rem"}>Delivery</Text>
                <Divider />
              </Card.Section>
              {/* bottom, right, left margins are negative – -1 * theme.spacing.xl */}
              <Card.Section>
                <Button
                  tt={"uppercase"}
                  onClick={() => {
                    if (bundle === "VIP") {
                      setBundle(null);
                    } else {
                      setBundle("VIP");
                    }
                  }}
                >
                  {bundle === "VIP" ? "selected" : "select"}
                </Button>
              </Card.Section>
            </Card>
          </SimpleGrid>
        </Stepper.Step>
        <Stepper.Completed>
          <Center sx={{ flexDirection: "column" }}>
            <Title align="center" weight={"normal"}>
              Ticket Summary
            </Title>
            <Divider w={"20rem"} mt={".75rem"} />
            <Box sx={{ textAlign: "center" }}>
              <Text size={"xl"} color="dimmed">
                Date
              </Text>
              <Text
                tt={"uppercase"}
                px={".75rem"}
                sx={(theme) => ({
                  color: theme.colors.violet[5],
                  border: `1px solid ${theme.colors.violet[5]}`,
                  borderRadius: "5px",
                })}
              >
                {datetime?.toDateString()}
              </Text>
            </Box>
            <Divider w={"20rem"} mt={".75rem"} />
            <Box>
              <Text size={"xl"} color="dimmed">
                Showtime
              </Text>
              <Text
                align="center"
                tt={"uppercase"}
                px={".75rem"}
                sx={(theme) => ({
                  color: theme.colors.teal[7],
                  border: `1px solid ${theme.colors.teal[7]}`,
                  borderRadius: "5px",
                })}
              >
                {showtime?.toUpperCase()}
              </Text>
            </Box>
            <Divider w={"20rem"} mt={".75rem"} />
            <Box sx={{ textAlign: "center" }}>
              <Text size={"xl"} color="dimmed">
                Seats
              </Text>
              <Group spacing={"xs"}>
                {selectedSeats.map((seat) => (
                  <Text
                    key={seat.id}
                    tt={"uppercase"}
                    px={".75rem"}
                    sx={(theme) => ({
                      color: theme.colors.blue[6],
                      border: `1px solid ${theme.colors.blue[6]}`,
                      borderRadius: "5px",
                    })}
                  >
                    {seat.row + seat.column}
                  </Text>
                ))}
              </Group>
            </Box>
            <Divider w={"20rem"} mt={".75rem"} />
            <Box sx={{ textAlign: "center" }}>
              <Text size={"xl"} color="dimmed">
                Bundle
              </Text>
              <Text
                tt={"uppercase"}
                px={".75rem"}
                sx={(theme) => ({
                  color: theme.colors.yellow[6],
                  border: `1px solid ${theme.colors.yellow[6]}`,
                  borderRadius: "5px",
                })}
              >
                {bundle ? bundle : "NO BUNDLE"}
              </Text>
            </Box>
            <Divider w={"20rem"} mt={".75rem"} />
          </Center>
        </Stepper.Completed>
      </Stepper>
      <Group position="center" mt="xl">
        <Button variant="default" onClick={prevStep}>
          Back
        </Button>
        {active < 2 && <Button onClick={nextStep}>Next step</Button>}
        {active === 2 && bundle && (
          <Button onClick={nextStep}>Next step</Button>
        )}
        {active === 2 && !bundle && <Button onClick={nextStep}>Skip</Button>}
        {active === 3 && (
          <Button
            onClick={() =>
              console.log({
                datetime,
                showtime,
                seatQuantity,
                selectedSeats,
                bundle,
              })
            }
          >
            Go to payment
          </Button>
        )}
      </Group>
    </Modal>
  );
};

const SeatPicker: React.FC<{
  room: Room;
  seatQuantity: number;
  selectedSeats: SeatByGroup[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<SeatByGroup[]>>;
}> = ({ selectedSeats, setSelectedSeats, room, seatQuantity }) => {
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  useEffect(() => {
    if (selectedSeats.length === 0) {
      setSelectedRow(null);
      setSelectedGroup(null);
    }
  }, [selectedSeats, selectedGroup]);
  return (
    <Flex gap={"4rem"} align={"flex-end"}>
      <SimpleGrid w={"1rem"} spacing={"1.23rem"}>
        {"ABCDEFGH".split("").map((letter) => (
          <Center
            key={letter}
            px={"1rem"}
            sx={(theme) => ({
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.gray[8]
                  : theme.colors.gray[2],
            })}
          >
            {letter}
          </Center>
        ))}
      </SimpleGrid>
      <Box>
        <Box
          p={".15rem"}
          mx={"2rem"}
          mb={".5rem"}
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.gray[8]
                : theme.colors.gray[2],
            borderRadius: ".25rem",
          })}
        >
          <Text size={"xl"} weight={"normal"} align="center">
            Screen
          </Text>
        </Box>
        <SimpleGrid cols={3} spacing={"3rem"}>
          <Box>
            <SimpleGrid cols={4}>
              {room.left.map((seat, idx) => (
                <SeatOption
                  key={idx}
                  seatQuantity={seatQuantity}
                  seat={seat}
                  selectedRow={selectedRow}
                  setSelectedRow={setSelectedRow}
                  selectedSeats={selectedSeats}
                  setSelectedSeats={setSelectedSeats}
                  selectedGroup={selectedGroup}
                  setSelectedGroup={setSelectedGroup}
                />
              ))}
            </SimpleGrid>
          </Box>
          <Box>
            <SimpleGrid cols={4}>
              {room.center.map((seat, idx) => (
                <SeatOption
                  key={idx}
                  seatQuantity={seatQuantity}
                  seat={seat}
                  selectedRow={selectedRow}
                  setSelectedRow={setSelectedRow}
                  selectedSeats={selectedSeats}
                  setSelectedSeats={setSelectedSeats}
                  selectedGroup={selectedGroup}
                  setSelectedGroup={setSelectedGroup}
                />
              ))}
            </SimpleGrid>
          </Box>
          <Box>
            <SimpleGrid cols={4}>
              {room.right.map((seat, idx) => (
                <SeatOption
                  key={idx}
                  seatQuantity={seatQuantity}
                  seat={seat}
                  selectedRow={selectedRow}
                  setSelectedRow={setSelectedRow}
                  selectedSeats={selectedSeats}
                  setSelectedSeats={setSelectedSeats}
                  selectedGroup={selectedGroup}
                  setSelectedGroup={setSelectedGroup}
                />
              ))}
            </SimpleGrid>
          </Box>
        </SimpleGrid>
      </Box>
    </Flex>
  );
};

const SeatOption: React.FC<{
  seatQuantity: number;
  seat: SeatByGroup;
  selectedSeats: SeatByGroup[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<SeatByGroup[]>>;
  selectedRow: string | null;
  setSelectedRow: React.Dispatch<React.SetStateAction<string | null>>;
  selectedGroup: string | null;
  setSelectedGroup: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({
  seatQuantity,
  seat,
  selectedRow,
  setSelectedRow,
  selectedSeats,
  setSelectedSeats,
  selectedGroup,
  setSelectedGroup,
}) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    if (seatQuantity === selectedSeats.length && !isSelected) return;
    if (!selectedRow) {
      setSelectedRow(seat.row);
    }
    if (!selectedGroup) {
      setSelectedGroup(seat.group);
    }
    if (selectedRow && seat.row !== selectedRow) return;
    if (selectedGroup && seat.group !== selectedGroup) return;
    if (!isSelected) {
      if (
        selectedSeats.length &&
        !selectedSeats.some(
          (selectedSeat) =>
            selectedSeat.column === seat.column - 1 ||
            selectedSeat.column === seat.column + 1
        )
      )
        return;
      setSelectedSeats((prev) => [...prev, seat]);
    } else {
      setSelectedSeats((prev) => prev.filter((old) => old.id !== seat.id));
      setIsSelected(!isSelected);
    }
    setIsSelected(!isSelected);
  };

  return (
    <Center>
      {seat.column}
      <ActionIcon
        ml={rem(2)}
        sx={(theme) => ({
          color: isSelected ? theme.colors.blue : theme.colors.white,
        })}
        onClick={handleClick}
      >
        <IconArmchair />
      </ActionIcon>
    </Center>
  );
};
export default NewTicketWizard;
