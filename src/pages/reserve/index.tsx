import axios from "axios";
import {
  Badge,
  Box,
  Flex,
  Group,
  Image,
  LoadingOverlay,
  MediaQuery,
  Text,
  Title,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconStarFilled } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { type NextPage } from "next";
import { useEffect, useState } from "react";
import NewTicketWizard from "~/componens/NewTicketWizard";
import { env } from "~/env.mjs";
import type { IMovie } from "~/types";
import { type RouterOutputs, api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";

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
      const { data } = await axios.get<IMovie>(
        `${env.NEXT_PUBLIC_TMDB_BASE_URL}/movie/${movie.imdbId}?api_key=${env.NEXT_PUBLIC_TMDB_API_KEY}`
      );

      const completeMovie: ICompleteMovie = {
        ...data,
        dbId: movie.id,
        screens: movie.screens as Screen[],
      };
      return completeMovie;
    })
  );
  return imdbMovies;
};

const Reserve: NextPage = () => {
  const user = useUser();
  const router = useRouter();
  useEffect(() => {
    if (user.isLoaded && !user.user) {
      void router.replace("/");
    }
  }, [user.isLoaded, user.user, router]);

  const tmdbImagePath = "https://image.tmdb.org/t/p/original";

  const [selectedMovie, setSelectedMovie] = useState<
    { title: string; id: string; screens: Screen[] } | null | undefined
  >(null);

  const disclosure = useDisclosure(false);

  const { data: movieIds, isLoading: loadingIds } = api.movie.getAll.useQuery();
  const { data: movies, isLoading: loadingMovies } = useQuery<
    ICompleteMovie[] | null
  >({
    queryKey: ["reserve-movies"],
    queryFn: () => fetchMovies(movieIds),
    enabled: !!movieIds,
  });

  if (loadingIds || loadingMovies) return <LoadingOverlay visible />;

  return (
    <main
      style={{
        minHeight: "42.6vh",
      }}
    >
      <NewTicketWizard
        userId={user.user?.id ?? ""}
        movie={selectedMovie}
        disclosure={disclosure}
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
            opacity={
              m.screens.every((s) => new Date(s.date) < new Date()) ? 0.7 : 1
            }
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
              <Flex gap={"sm"} align={"center"}>
                <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
                  <Image
                    width={rem(50)}
                    src={tmdbImagePath + m.poster_path}
                    alt={m.title ?? ""}
                  />
                </MediaQuery>
                <Box>
                  <Flex align={"center"} gap={"xs"} mb={"xs"}>
                    <Text
                      display={"inline"}
                      sx={{
                        verticalAlign: "baseline",
                      }}
                    >
                      <Title
                        display={"inline"}
                        size={"1.5rem"}
                        weight={"normal"}
                        sx={{
                          cursor: "pointer",
                          ":hover": {
                            textDecoration: "underline",
                          },
                          "@media (max-width: 40em)": {
                            fontSize: "1.25rem",
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
                      </Title>{" "}
                      <Badge
                        variant="filled"
                        size="md"
                        sx={{
                          verticalAlign: "text-top",
                        }}
                      >
                        {m.original_language}
                      </Badge>
                    </Text>
                    <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
                      <>{m.adult && <Text color="red">Adult</Text>}</>
                    </MediaQuery>
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
                        <Badge
                          key={date}
                          sx={(theme) => ({
                            backgroundColor:
                              theme.colorScheme === "dark"
                                ? theme.colors.dark
                                : theme.colors.gray[2],
                            color:
                              theme.colorScheme !== "dark"
                                ? theme.colors.dark[4]
                                : theme.colors.gray[3],
                            cursor: "default",
                          })}
                          size="lg"
                          radius={"md"}
                        >
                          {date}
                        </Badge>
                      ))}
                    </Group>
                  </Flex>
                </Box>
              </Flex>
            </Box>
            <Box>
              <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
                <Flex align={"center"} gap={"xs"}>
                  <Text size={"1.75rem"}>{Math.round(m.vote_average)}/10</Text>
                  <IconStarFilled size={"2rem"} style={{ color: "#FFD43B" }} />
                </Flex>
              </MediaQuery>
            </Box>
          </Box>
        ))}
      </Box>
    </main>
  );
};

export default Reserve;
