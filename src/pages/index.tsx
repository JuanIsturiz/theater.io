import { Center, Divider, LoadingOverlay, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type NextPage } from "next";
import MovieCarousel from "~/componens/MovieCarousel";
import MovieList from "~/componens/MovieList";
import { env } from "~/env.mjs";
import type { IMovie, IMoviesJson, Result } from "~/types";
import { type RouterOutputs, api } from "~/utils/api";

type Movie = RouterOutputs["movie"]["getForCarousel"][number];

const fetchMovies = async (limit: number) => {
  const { data } = await axios.get<IMoviesJson>(
    `${env.NEXT_PUBLIC_TMDB_BASE_URL}/trending/movie/day?api_key=${env.NEXT_PUBLIC_TMDB_API_KEY}`
  );
  return data.results.slice(0, limit);
};

const fetchCarouselMovies = async (movies: Movie[] | undefined) => {
  if (!movies) return null;

  const imdbMovies: IMovie[] = await Promise.all(
    movies.map(async (movie) => {
      const { data } = await axios.get<IMovie>(
        `${env.NEXT_PUBLIC_TMDB_BASE_URL}/movie/${movie.imdbId}?api_key=${env.NEXT_PUBLIC_TMDB_API_KEY}`
      );

      return data;
    })
  );
  return imdbMovies;
};

const Home: NextPage = () => {
  const { data: movies, isLoading: loadingMovies } = useQuery<Result[]>({
    queryKey: ["movies"],
    queryFn: () => fetchMovies(12),
  });

  const { data: carouselIds, isLoading: loadingCarouselIds } =
    api.movie.getForCarousel.useQuery();

  const { data: carouselMovies, isLoading: loadingCarouselMovies } = useQuery<
    IMovie[] | null
  >({
    queryKey: ["carousel-movies"],
    queryFn: () => fetchCarouselMovies(carouselIds),
    enabled: !!carouselIds,
  });

  if (loadingMovies || loadingCarouselIds || loadingCarouselMovies)
    return <LoadingOverlay visible />;

  if (!movies || !carouselMovies)
    return (
      <Center>
        <Text>Something went wrong!</Text>
      </Center>
    );

  return (
    <main>
      <MovieCarousel movies={carouselMovies} />
      <Divider my={"1rem"} />
      <MovieList movies={movies} />
    </main>
  );
};

export default Home;
