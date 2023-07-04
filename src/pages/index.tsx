import { Divider, LoadingOverlay } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type NextPage } from "next";
import MovieCarousel from "~/componens/MovieCarousel";
import MovieList from "~/componens/MovieList";
import { env } from "~/env.mjs";
import type { IMoviesJson, Result } from "~/types";

const fetchMovies = async (limit: number) => {
  const { data } = await axios.get<IMoviesJson>(
    `${env.NEXT_PUBLIC_TMDB_BASE_URL}/trending/movie/day?api_key=${env.NEXT_PUBLIC_TMDB_API_KEY}`
  );
  return data.results.slice(0, limit);
};

//todo add carousel movies and reserve now functionality

const Home: NextPage = () => {
  const { data: movies, isLoading } = useQuery<Result[]>({
    queryKey: ["movies"],
    queryFn: () => fetchMovies(12),
  });

  return (
    <main>
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      <MovieCarousel movies={movies} />
      <Divider my={"1rem"} />
      <MovieList movies={movies} />
    </main>
  );
};

export default Home;
