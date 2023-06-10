import { SimpleGrid } from "@mantine/core";
import { Result } from "~/types";
import MoviePanel from "./MoviePanel";

interface MovieListProps {
  movies: Result[] | undefined;
}

const MovieList: React.FC<MovieListProps> = ({ movies }) => {
  return (
    <SimpleGrid
      cols={4}
      spacing="xl"
      breakpoints={[
        { maxWidth: "md", cols: 3, spacing: "md" },
        { maxWidth: "sm", cols: 2, spacing: "sm" },
        { maxWidth: "xs", cols: 1, spacing: "sm" },
      ]}
    >
      {movies?.map((m) => (
        <MoviePanel key={m.id} movie={m} />
      ))}
    </SimpleGrid>
  );
};

export default MovieList;
