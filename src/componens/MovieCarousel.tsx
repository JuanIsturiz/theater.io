import { Carousel } from "@mantine/carousel";
import { Box, Button, Group, Text, Title } from "@mantine/core";
import { Result } from "~/types";
import styles from "~/styles/movies.module.css";

interface MovieCarouselProps {
  movies: Result[] | undefined;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ movies }) => {
  if (!movies) return null;
  return (
    <Carousel withIndicators height={400}>
      <Carousel.Slide>
        <MovieSlide movie={movies[0]} />
      </Carousel.Slide>
      <Carousel.Slide>
        <MovieSlide movie={movies[1]} />
      </Carousel.Slide>
      <Carousel.Slide>
        <MovieSlide movie={movies[2]} />
      </Carousel.Slide>
    </Carousel>
  );
};

const MovieSlide: React.FC<{ movie: Result | undefined }> = ({ movie }) => {
  const tmdbImagePath = "https://image.tmdb.org/t/p/original";

  return (
    <Box
      className={styles.movieSlide}
      px={"2.75rem"}
      py={".5rem"}
      sx={{
        backgroundImage: `url(${tmdbImagePath + movie?.backdrop_path})`,
      }}
    >
      <Title
        className={styles.movieSlideTitle}
        pos={"relative"}
        mb={"1.25rem"}
        color="white"
        sx={{
          zIndex: 10,
        }}
      >
        {movie?.title}
      </Title>
      <Box px={".5rem"}>
        <Text
          mb={"2rem"}
          pos={"relative"}
          weight={"bold"}
          color="white"
          sx={{
            zIndex: 10,
          }}
        >
          {movie?.overview}
        </Text>
        <Group className={styles.movieSliceButtons}>
          <Button
            size="lg"
            sx={{
              zIndex: 10,
            }}
          >
            Reserve Now
          </Button>
          <Button
            size="lg"
            variant="default"
            sx={{
              zIndex: 10,
            }}
          >
            More Info
          </Button>
        </Group>
      </Box>
    </Box>
  );
};

export default MovieCarousel;