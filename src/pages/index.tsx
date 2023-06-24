import { Divider, LoadingOverlay } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { type NextPage } from "next";
import MovieCarousel from "~/componens/MovieCarousel";
import MovieList from "~/componens/MovieList";
import { env } from "~/env.mjs";
import type { IMoviesJson, Result } from "~/types";

const fetchMovies = async (limit: number) => {
  const res: Response = await fetch(
    `${env.NEXT_PUBLIC_TMDB_BASE_URL}/trending/movie/day?api_key=${env.NEXT_PUBLIC_TMDB_API_KEY}`
  );
  const json: IMoviesJson = await res.json();
  return json.results.slice(0, limit);
};

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
