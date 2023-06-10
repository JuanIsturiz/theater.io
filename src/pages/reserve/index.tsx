import { List, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { type NextPage } from "next";
import { env } from "~/env.mjs";
import { IMoviesJson, Result } from "~/types";

const fetchMovies = async (limit: number) => {
  const res = await fetch(
    `${env.NEXT_PUBLIC_TMDB_BASE_URL}/trending/movie/day?api_key=${env.NEXT_PUBLIC_TMDB_API_KEY}`
  );
  const json: IMoviesJson = await res.json();
  return json.results.slice(0, limit);
};

const Reserve: NextPage = () => {
  const { data: movies, isLoading } = useQuery<Result[]>({
    queryKey: ["movies"],
    queryFn: () => fetchMovies(8),
  });

  return (
    <main>
      <Title>On theaters</Title>
      <List>
        {movies?.map((m) => (
          <List.Item key={m.id}>{m.title || m.name}</List.Item>
        ))}
      </List>
    </main>
  );
};

export default Reserve;
