import { useState } from "react";
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
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { IconArmchair, IconMovie } from "@tabler/icons-react";
interface NewTicketWizardProps {
  movieTitle: string | null | undefined;
  initialShowtime: string;
  disclosure: readonly [
    boolean,
    {
      readonly open: () => void;
      readonly close: () => void;
      readonly toggle: () => void;
    }
  ];
}

interface Seat {
  row: string | undefined;
  col: number;
  available: boolean;
  userId: string | null;
}

interface Room {
  left: Array<Seat>;
  center: Array<Seat>;
  right: Array<Seat>;
}

const getSeats = () => {
  const room: Room = {
    left: [],
    center: [],
    right: [],
  };
  const letters = "ABCDEFGH";
  let letterIdx = 0;
  for (let i = 1; i < 9; i++) {
    for (let j = 1; j < 13; j++) {
      if (j < 5) {
        room.left.push({
          col: j,
          row: letters[letterIdx],
          available: false,
          userId: null,
        });
      } else if (j > 4 && j < 9) {
        room.center.push({
          col: j,
          row: letters[letterIdx],
          available: false,
          userId: null,
        });
      } else {
        room.right.push({
          col: j,
          row: letters[letterIdx],
          available: false,
          userId: null,
        });
      }
    }
    letterIdx++;
  }
  return room;
};

//todo change Radios to SegmentedControl

const NewTicketWizard: React.FC<NewTicketWizardProps> = ({
  movieTitle,
  initialShowtime,
  disclosure,
}) => {
  const [opened, { open, close }] = disclosure;

  // testing variables
  const availableDates = [1686715200000, 1686888000000, 1686974400000];

  // mantine
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  // ticket values
  const [showtime, setShowtime] = useState<string | null>(null);
  const [datetime, setDatetime] = useState<Date | null>(null);
  const [reservetSeats, setReservedSeats] = useState<Array<Seat>>([]);
  const [bundle, setBundle] = useState<number | null>(null);

  const handleClose = () => {
    setShowtime(null);
    setDatetime(null);
    setReservedSeats([]);
    setBundle(null);
    setActive(0);
    close();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={movieTitle || "Movie Ticket"}
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
                    return !availableDates.some(
                      (avDate) => avDate === date.getTime()
                    );
                  }}
                />
              </Group>
            </Box>
            <Box>
              <Box sx={{ textAlign: "center" }} mb={"xl"}>
                <Radio.Group
                  value={showtime || initialShowtime}
                  onChange={setShowtime}
                  name="showtime"
                  label="Select your desired showtime"
                  description="Only available option will be on display"
                >
                  <Flex gap={"sm"} mt={"sm"}>
                    <Radio value={"0"} label="1:30pm" />
                    <Radio value={"1"} label="4:00pm" />
                    <Radio value={"2"} label="6:30pm" />
                    <Radio value={"3"} label="9:00pm" />
                  </Flex>
                </Radio.Group>
              </Box>
              <NumberInput
                label="Number of seats"
                description="From 0 to 4"
                placeholder="2 Seats"
                max={4}
                min={1}
              />
            </Box>
          </Flex>
        </Stepper.Step>
        {/* Seats */}
        <Stepper.Step label="Seats" description="Seats location and quantity">
          <SeatPicker room={getSeats()} />
        </Stepper.Step>
        {/* Bundle */}
        <Stepper.Step label="Bundle" description="Choose bundle">
          <SimpleGrid cols={3} mt={"1rem"}>
            <Card
              p="xl"
              sx={{ textAlign: "center", overflow: "visible" }}
              opacity={bundle === 0 ? 0.7 : 1}
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
                <Button tt={"uppercase"} onClick={() => setBundle(0)}>
                  {bundle === 0 ? "selected" : "select"}
                </Button>
              </Card.Section>
            </Card>
            <Card
              p="xl"
              sx={{ textAlign: "center", overflow: "visible" }}
              opacity={bundle === 1 ? 0.7 : 1}
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
                  onClick={() => setBundle(1)}
                >
                  {bundle === 1 ? "selected" : "select"}
                </Button>
              </Card.Section>
            </Card>{" "}
            <Card
              p="xl"
              sx={{ textAlign: "center", overflow: "visible" }}
              opacity={bundle === 2 ? 0.7 : 1}
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
                <Button tt={"uppercase"} onClick={() => setBundle(2)}>
                  {bundle === 2 ? "selected" : "select"}
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
                {new Date().toDateString()}
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
                6:30PM
              </Text>
            </Box>
            <Divider w={"20rem"} mt={".75rem"} />
            <Box sx={{ textAlign: "center" }}>
              <Text size={"xl"} color="dimmed">
                Seats
              </Text>
              <Group spacing={"xs"}>
                <Text
                  tt={"uppercase"}
                  px={".75rem"}
                  sx={(theme) => ({
                    color: theme.colors.blue[6],
                    border: `1px solid ${theme.colors.blue[6]}`,
                    borderRadius: "5px",
                  })}
                >
                  B6
                </Text>
                <Text
                  tt={"uppercase"}
                  px={".75rem"}
                  sx={(theme) => ({
                    color: theme.colors.blue[6],
                    border: `1px solid ${theme.colors.blue[6]}`,
                    borderRadius: "5px",
                  })}
                >
                  B7
                </Text>
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
                PREMIUM
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
        {active < 3 && <Button onClick={nextStep}>Next step</Button>}
        {active === 3 && (
          <Button onClick={() => console.log("purchase!")}>
            Go to payment
          </Button>
        )}
      </Group>
    </Modal>
  );
};

const SeatPicker: React.FC<{ room: Room }> = ({ room }) => {
  const [numSeats, setNumSeats] = useState(0);
  const [seatsLocation, setSeatsLocation] = useState<Array<number>>([]);

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
                <Center key={idx}>
                  {seat.col}
                  <ActionIcon>
                    <IconArmchair />
                  </ActionIcon>
                </Center>
              ))}
            </SimpleGrid>
          </Box>
          <Box>
            <SimpleGrid cols={4}>
              {room.center.map((seat, idx) => (
                <Center key={idx}>
                  {seat.col}
                  <ActionIcon>
                    <IconArmchair />
                  </ActionIcon>
                </Center>
              ))}
            </SimpleGrid>
          </Box>
          <Box>
            <SimpleGrid cols={4}>
              {room.right.map((seat, idx) => (
                <Center key={idx}>
                  {seat.col}
                  <ActionIcon>
                    <IconArmchair />
                  </ActionIcon>
                </Center>
              ))}
            </SimpleGrid>
          </Box>
        </SimpleGrid>
      </Box>
    </Flex>
  );
};

export default NewTicketWizard;
