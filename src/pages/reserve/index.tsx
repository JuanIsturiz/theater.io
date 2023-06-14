import { Box, Button, Flex, Group, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconStarFilled } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { type NextPage } from "next";
import { useState } from "react";
import NewTicketWizard from "~/componens/NewTicketWizard";
import { env } from "~/env.mjs";
import type { IMoviesJson, Result } from "~/types";

const fetchMovies = async (limit: number) => {
  const res = await fetch(
    `${env.NEXT_PUBLIC_TMDB_BASE_URL}/trending/movie/day?api_key=${env.NEXT_PUBLIC_TMDB_API_KEY}`
  );
  const json: IMoviesJson = await res.json();
  return json.results.slice(0, limit);
};

const Reserve: NextPage = () => {
  const [selectedMovie, setSelectedMovie] = useState<string | null | undefined>(
    null
  );

  const [initialShowtime, setInitialShowtime] = useState<string>("0");

  const disclosure = useDisclosure(false);

  const { data: movies, isLoading } = useQuery<Result[]>({
    queryKey: ["movies"],
    queryFn: () => fetchMovies(8),
  });

  return (
    <main
      style={{
        minHeight: "42.6vh",
      }}
    >
      <NewTicketWizard
        movieTitle={selectedMovie}
        disclosure={disclosure}
        initialShowtime={initialShowtime}
      />
      <Title tt={"uppercase"} align="center" weight={"normal"}>
        On theaters
      </Title>
      <Text align="center" mb={"1rem"} opacity={0.6}>
        Select your desired movie
      </Text>
      <Box
        mx={"1rem"}
        sx={{
          borderTop: "1px solid #AAA",
        }}
      >
        {movies?.map((m) => (
          <Box
            p={".5rem"}
            key={m.id}
            sx={(theme) => ({
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #AAA",
              ":hover": {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.gray[9]
                    : theme.colors.gray[1],
              },
            })}
          >
            <Box>
              <Flex align={"center"} gap={"xs"} mb={"xs"}>
                <Title
                  size={"1.5rem"}
                  weight={"normal"}
                  sx={{
                    cursor: "pointer",
                    ":hover": {
                      textDecoration: "underline",
                    },
                  }}
                  onClick={() => {
                    setSelectedMovie(m.title || m.name);
                    setInitialShowtime("0");
                    disclosure[1].open();
                  }}
                >
                  {m.title || m.name}
                </Title>
                <Text
                  tt={"uppercase"}
                  px={".75rem"}
                  sx={(theme) => ({
                    color: theme.colors.blue[6],
                    border: `1px solid ${theme.colors.blue[6]}`,
                    borderRadius: "5px",
                  })}
                >
                  {m.original_language}
                </Text>
                {m.adult && <Text color="red">Adult</Text>}
              </Flex>
              <Flex align={"center"} gap={"xs"}>
                <Text>Available Schedules:</Text>
                <Group spacing={"xs"}>
                  <Button
                    color="gray"
                    variant="light"
                    size="xs"
                    onClick={() => {
                      setSelectedMovie(m.title || m.name);
                      setInitialShowtime("0");
                      disclosure[1].open();
                    }}
                  >
                    4:00pm
                  </Button>
                  <Button
                    color="gray"
                    variant="light"
                    size="xs"
                    onClick={() => {
                      setSelectedMovie(m.title || m.name);
                      setInitialShowtime("1");
                      disclosure[1].open();
                    }}
                  >
                    6:30pm
                  </Button>
                  <Button
                    color="gray"
                    variant="light"
                    size="xs"
                    onClick={() => {
                      setSelectedMovie(m.title || m.name);
                      setInitialShowtime("2");
                      disclosure[1].open();
                    }}
                  >
                    9:00pm
                  </Button>
                </Group>
              </Flex>
            </Box>
            <Box>
              <Flex align={"center"} gap={"xs"}>
                <Text size={"1.75rem"}>{Math.round(m.vote_average)}/10</Text>
                <IconStarFilled size={"2rem"} style={{ color: "#FFD43B" }} />
              </Flex>
            </Box>
          </Box>
        ))}
      </Box>
    </main>
  );
};

export default Reserve;
