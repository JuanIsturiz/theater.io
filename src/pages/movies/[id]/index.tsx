import axios from "axios";
import { Box, Flex, Image, SimpleGrid, Text, Title, rem } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import type { GetServerSidePropsContext, NextPage } from "next";
import { env } from "~/env.mjs";
import type { IMovie } from "~/types";
import { IconStar, IconStarFilled } from "@tabler/icons-react";

// hours converter helper
const toHoursAndMinutes = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};

const fetchMovie = async (id: string) => {
  const { data } = await axios.get<IMovie>(
    `${env.NEXT_PUBLIC_TMDB_BASE_URL}/movie/${id}?api_key=${env.NEXT_PUBLIC_TMDB_API_KEY}`
  );
  return data;
};

const MoviePage: NextPage<{ id: string }> = ({ id }) => {
  const tmdbImagePath = "https://image.tmdb.org/t/p/original";
  const { data: movie } = useQuery<IMovie>({
    queryKey: ["movie"],
    queryFn: () => fetchMovie(id),
  });

  if (!movie) return null;

  return (
    <main>
      <Box
        sx={{
          boxShadow: `rgba(0, 0, 0, 0.75) 0px 5px 15px`,
        }}
      >
        <Box
          p={rem(20)}
          pos={"relative"}
          sx={{
            backgroundImage: `url(${tmdbImagePath + movie.backdrop_path})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            "::after": {
              content: '""',
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0, 0, 0, .5)",
            },
          }}
        >
          <Flex
            my={"auto"}
            pos={"relative"}
            sx={{
              zIndex: 10,
            }}
            gap={"xl"}
          >
            <Box
              h={rem(386)}
              w={rem(246)}
              sx={(theme) => ({
                borderStyle: "solid",
                borderWidth: "3px",
                borderRadius: rem(3),
                borderColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark
                    : theme.colors.gray[6],
              })}
            >
              <Image
                height={rem(380)}
                width={rem(240)}
                src={tmdbImagePath + movie.poster_path}
                alt={movie.title || "Movie Poster"}
              />
            </Box>
            <Box>
              <Title
                color="white"
                sx={{
                  textShadow: "rgba(0, 0, 0, 0.9) 0px 3px 3px",
                }}
              >
                {movie.title}
              </Title>
              <Text size={"xl"} color="white">
                {movie.release_date.toString().replaceAll("-", "/")}
              </Text>
              <Text size={"xl"} color="white">
                {movie.genres.map((g) => g.name).join(", ")}
              </Text>
              <Text size={"xl"} color="white">
                {toHoursAndMinutes(movie.runtime)}
              </Text>
              <RatingStars voteAverage={movie.vote_average} />
              <Text size={"lg"} fs={"italic"} color="gray.4" my={rem(20)}>
                {movie.tagline}
              </Text>
              <Text size={"xl"} weight={500} color="white">
                Overview
              </Text>
              <Text size={"lg"} color="white">
                {movie.overview}
              </Text>
            </Box>
          </Flex>
        </Box>
        <Box py={rem(10)} bg={"blue"} sx={{ color: "#000" }}>
          <SimpleGrid cols={4}>
            <Box sx={{ textAlign: "center" }}>
              <Text weight={"bold"}>Status</Text>
              <Text weight={500}>{movie.status}</Text>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Text weight={"bold"}>Original Language</Text>
              <Text weight={500}>{movie.original_language.toUpperCase()}</Text>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Text weight={"bold"}>Budget</Text>
              <Text weight={500}>${movie.budget.toLocaleString()}</Text>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Text weight={"bold"}>Revenue</Text>
              <Text weight={500}>${movie.revenue.toLocaleString()}</Text>
            </Box>
          </SimpleGrid>
        </Box>
      </Box>
    </main>
  );
};

const RatingStars: React.FC<{ voteAverage: number }> = ({ voteAverage }) => {
  const roundedVoteAverage = Math.round(voteAverage / 2);
  const ratingArray = new Array(5)
    .fill(false)
    .map((_, idx) => (idx + 1 <= roundedVoteAverage ? true : false));
  return (
    <Box>
      {ratingArray.map((rating, idx) =>
        rating ? (
          <IconStarFilled
            key={idx}
            size={rem(30)}
            style={{
              color: "#1C7ED6",
            }}
          />
        ) : (
          <IconStar key={idx} size={rem(30)} color="#1C7ED6" />
        )
      )}
    </Box>
  );
};

export const getServerSideProps = (
  context: GetServerSidePropsContext<{ id: string }>
) => {
  const id = context.params?.id;

  return {
    props: {
      id,
    },
  };
};

export default MoviePage;
