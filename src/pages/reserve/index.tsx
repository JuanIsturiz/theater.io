import { Box, Button, Flex, Group, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconStarFilled } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { type NextPage } from "next";
import { useState } from "react";
import NewTicketWizard from "~/componens/NewTicketWizard";
import { env } from "~/env.mjs";
import type { IMovie } from "~/types";
import { type RouterOutputs, api } from "~/utils/api";

type Movie = RouterOutputs["movie"]["getAll"][number];
type Screen = RouterOutputs["screen"]["getAll"][number];

interface ICompleteMovie extends IMovie {
  dbId: string;
  screens: Screen[];
}

const fetchMovies = async (movies: Movie[] | undefined) => {
  if (!movies) return null;
  const imdbMovies: ICompleteMovie[] = await Promise.all(
    movies.map(async (movie) => {
      const res: Response = await fetch(
        `${env.NEXT_PUBLIC_TMDB_BASE_URL}/movie/${movie.imdbId}?api_key=${env.NEXT_PUBLIC_TMDB_API_KEY}`
      );
      const json: IMovie = await res.json();

      const completeMovie: ICompleteMovie = {
        ...json,
        dbId: movie.id,
        screens: movie.screens as Screen[],
      };
      return completeMovie;
    })
  );
  return imdbMovies;
};

const Reserve: NextPage = () => {
  const [selectedMovie, setSelectedMovie] = useState<
    { title: string; id: string; screens: Screen[] } | null | undefined
  >(null);

  const disclosure = useDisclosure(false);

  const { data: movieIds } = api.movie.getAll.useQuery();
  const {
    data: movies,
    // isLoading
  } = useQuery<ICompleteMovie[] | null>({
    queryKey: ["movies"],
    queryFn: () => fetchMovies(movieIds),
    enabled: !!movieIds,
  });
  return (
    <main
      style={{
        minHeight: "42.6vh",
      }}
    >
      <NewTicketWizard movie={selectedMovie} disclosure={disclosure} />
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
                    setSelectedMovie({
                      title: m.title,
                      id: m.dbId,
                      screens: m.screens,
                    });
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
                <Text>Available Dates:</Text>
                <Group spacing={"xs"}>
                  {Array.from(
                    new Set(
                      m.screens?.map((screen) =>
                        screen.date.toLocaleDateString()
                      )
                    )
                  ).map((date) => (
                    <Button
                      key={date}
                      sx={{ cursor: "default" }}
                      color="gray"
                      variant="light"
                      size="xs"
                    >
                      {date}
                    </Button>
                  ))}
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
