import {
  ActionIcon,
  Box,
  Button,
  Center,
  Container,
  Flex,
  LoadingOverlay,
  Pagination,
  SegmentedControl,
  Select,
  SimpleGrid,
  Text,
  TextInput,
  Title,
  rem,
} from "@mantine/core";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type { NextPage } from "next";
import { env } from "~/env.mjs";
import type { IDiscoverJson, IGenresJson, ISearchJson } from "~/types";
import { useState } from "react";
import { IconSearch, IconX } from "@tabler/icons-react";
import MovieList from "~/componens/MovieList";

interface IQuery {
  page: number;
  with_genres: number | null;
  sort_by: string;
  vote_average: string | null;
  order_by: string | null;
}

const ORDER_OPTIONS = [
  { value: "popularity", label: "Popularity" },
  { value: "revenue", label: "Revenue" },
  { value: "primary_release_date", label: "Release Date" },
  { value: "vote_average", label: "Vote Average" },
  { value: "vote_count", label: "Vote Count" },
];

const VOTE_OPTIONS = [
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
  { value: "5", label: "5+" },
  { value: "6", label: "6+" },
  { value: "7", label: "7+" },
  { value: "8", label: "8+" },
  { value: "9", label: "9+" },
];

const fetchGenres = async () => {
  const { data } = await axios.get<IGenresJson>(
    `${env.NEXT_PUBLIC_TMDB_BASE_URL}/genre/movie/list?language=en&api_key=${env.NEXT_PUBLIC_TMDB_API_KEY}`
  );
  return data.genres;
};

const fetchDiscoverMovies = async (query: IQuery) => {
  let queries = `${env.NEXT_PUBLIC_TMDB_BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&`;

  Object.keys(query).forEach((key) => {
    if (key === "vote_average") {
      queries += `${key}.gte=${query[key as keyof IQuery] ?? 0}`;
      queries += "&";
      return;
    }
    if (key === "order_by") return;
    if (key === "sort_by") {
      if (!query["order_by"]) {
        queries += `${key}=popularity.desc`;
      } else {
        queries += `${key}=${query.order_by}.${query.sort_by}`;
      }
      queries += "&";
      return;
    }
    queries += `${key}=${query[key as keyof IQuery] ?? ""}`;
    queries += "&";
  });
  queries += "api_key=" + env.NEXT_PUBLIC_TMDB_API_KEY;
  const { data } = await axios.get<IDiscoverJson>(queries);
  console.log({ data });

  return data;
};

const fetchSearchMovies = async (info: { query: string; page: number }) => {
  const { data } = await axios.get<ISearchJson>(
    `${env.NEXT_PUBLIC_TMDB_BASE_URL}/search/movie?include_adult=false&language=en-US&page=${info.page}&query=${info.query}&api_key=${env.NEXT_PUBLIC_TMDB_API_KEY}`
  );
  return data;
};

const Movies: NextPage = () => {
  const { data: genres } = useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
  });

  // search
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedOrderBy, setSelectedOrderBy] = useState<string | null>(null);
  const [selectedVoteAvg, setSelectedVoteAvg] = useState<string | null>(null);
  const [sort, setSort] = useState("desc");
  const [movieList, setMovieList] = useState<"discover" | "search">("discover");

  const {
    data: discoverData,
    isLoading: loadingDiscover,
    refetch: refetchDiscover,
  } = useQuery({
    queryKey: ["discover-movies", page],
    queryFn: () =>
      fetchDiscoverMovies({
        page,
        with_genres: genres?.find((g) => g.name === selectedGenre)?.id || null,
        order_by: selectedOrderBy,
        vote_average: selectedVoteAvg,
        sort_by: sort,
      }),
  });

  const {
    data: searchData,
    isFetching: fetchingSearch,
    refetch: refetchSearch,
  } = useQuery({
    queryKey: ["search-movies", page],
    queryFn: () =>
      fetchSearchMovies({
        query: search,
        page: page,
      }),
    enabled: movieList === "search",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    if (search) {
      void refetchSearch();
      setMovieList("search");
    } else {
      void refetchDiscover();
      setMovieList("discover");
    }
  };

  const movies =
    movieList === "discover" ? discoverData?.results : searchData?.results;

  const moviePages =
    movieList === "discover"
      ? discoverData?.total_pages
      : searchData?.total_pages;

  if (loadingDiscover || fetchingSearch) return <LoadingOverlay visible />;

  if (!movies) return null;

  return (
    <main>
      <Title tt={"uppercase"} align="center" weight={"normal"}>
        movies
      </Title>
      <Text align="center" mb={"1rem"} opacity={0.6}>
        Browse and discover more movies!
      </Text>
      <Container size={"lg"}>
        <form onSubmit={handleSubmit}>
          <Flex justify={"stretch"} align={"center"} gap={"md"}>
            <TextInput
              sx={{ flexGrow: 1 }}
              mb={rem(10)}
              label="Search Term"
              icon={<IconSearch size={rem(20)} />}
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              rightSection={
                search && (
                  <ActionIcon>
                    <IconX
                      cursor={"pointer"}
                      size={rem(20)}
                      onClick={() => setSearch("")}
                    />
                  </ActionIcon>
                )
              }
            />
            <Button mt={rem(15)} px={rem(30)} type="submit">
              Search
            </Button>
          </Flex>
        </form>
        <SimpleGrid
          mb={"xl"}
          cols={4}
          breakpoints={[
            { maxWidth: "md", cols: 3, spacing: "md" },
            { maxWidth: "sm", cols: 2, spacing: "sm" },
            { maxWidth: "xs", cols: 1, spacing: "sm" },
          ]}
        >
          <Box>
            {genres?.length && (
              <Select
                searchable
                nothingFound="No options"
                clearable
                label="By Genre"
                placeholder="Pick one"
                value={selectedGenre}
                onChange={setSelectedGenre}
                data={genres.map((g) => ({ value: g.name, label: g.name }))}
              />
            )}
          </Box>
          <Box>
            <Select
              clearable
              label="Order By"
              placeholder="Pick one"
              value={selectedOrderBy}
              onChange={setSelectedOrderBy}
              data={ORDER_OPTIONS.map((o) => ({
                value: o.value,
                label: o.label,
              }))}
            />
          </Box>
          <Box>
            <Select
              clearable
              label="Vote Average"
              placeholder="Pick one"
              value={selectedVoteAvg}
              onChange={setSelectedVoteAvg}
              data={VOTE_OPTIONS.map((v) => ({
                value: v.value,
                label: v.label,
              }))}
            />
          </Box>
          <Box mt={rem(2)}>
            <Text size={"sm"} weight={500}>
              Sort By
            </Text>
            <SegmentedControl
              value={sort}
              onChange={setSort}
              data={[
                { label: "Ascending", value: "asc" },
                { label: "Descending", value: "desc" },
              ]}
            />
          </Box>
        </SimpleGrid>
        <Center mb={rem(30)}>
          <Pagination value={page} onChange={setPage} total={moviePages ?? 0} />
        </Center>
        <MovieList movies={movies} />
        <Center mt={rem(30)}>
          <Pagination value={page} onChange={setPage} total={moviePages ?? 0} />
        </Center>
      </Container>
    </main>
  );
};

export default Movies;
