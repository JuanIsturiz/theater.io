import { Box, Button, Flex, Group, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconStarFilled } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { type NextPage } from "next";
import { useState } from "react";
import NewTicketWizard from "~/componens/NewTicketWizard";
import { env } from "~/env.mjs";
import type { IMovie } from "~/types";
import { api } from "~/utils/api";

const fetchMovies = async (ids: string[]) => {
  const movies: IMovie[] = await Promise.all(
    ids.map(async (movieId) => {
      const res = await fetch(
        `${env.NEXT_PUBLIC_TMDB_BASE_URL}/movie/${movieId}?api_key=${env.NEXT_PUBLIC_TMDB_API_KEY}`
      );
      const json = await res.json();
      return json;
    })
  );
  return movies;
};

const Reserve: NextPage = () => {
  const [selectedMovie, setSelectedMovie] = useState<string | null | undefined>(
    null
  );

  const [initialShowtime, setInitialShowtime] = useState<string>("0");

  const disclosure = useDisclosure(false);

  const { data: movieIds } = api.movie.getAll.useQuery();

  const { data: movies, isLoading } = useQuery<IMovie[]>({
    queryKey: ["movies"],
    queryFn: () => fetchMovies(movieIds?.map((m) => m.imdbId) ?? [""]),
    enabled: !!movieIds,
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
                    setSelectedMovie(m.title);
                    setInitialShowtime("0");
                    disclosure[1].open();
                  }}
                >
                  {m.title}
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
                      setSelectedMovie(m.title);
                      setInitialShowtime("0");
                      disclosure[1].open();
                    }}
                  >
                    1:30pm
                  </Button>
                  <Button
                    color="gray"
                    variant="light"
                    size="xs"
                    onClick={() => {
                      setSelectedMovie(m.title);
                      setInitialShowtime("1");
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
                      setSelectedMovie(m.title);
                      setInitialShowtime("2");
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
                      setSelectedMovie(m.title);
                      setInitialShowtime("3");
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
