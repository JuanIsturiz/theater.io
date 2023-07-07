import { Carousel } from "@mantine/carousel";
import { Box, Button, Group, Spoiler, Text, Title } from "@mantine/core";
import type { IMovie } from "~/types";
import styles from "~/styles/movies.module.css";
import Link from "next/link";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

interface MovieCarouselProps {
  movies: IMovie[] | undefined;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ movies }) => {
  if (!movies) return null;
  return (
    <Carousel
      withIndicators
      sx={{
        height: 400,
        "@media (max-width: 30em)": {
          height: 500,
        },
      }}
    >
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

const MovieSlide: React.FC<{
  movie: IMovie | undefined;
}> = ({ movie }) => {
  const tmdbImagePath = "https://image.tmdb.org/t/p/original";

  return (
    <Box
      className={styles.movieSlide}
      px={"2.75rem"}
      py={".5rem"}
      sx={{
        height: 400,
        backgroundImage: `url(${tmdbImagePath}${movie?.backdrop_path ?? ""})`,
        "@media (max-width: 30em)": {
          height: 500,
        },
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
            "@media (max-width: 30em)": {
              fontSize: ".9rem",
            },
          }}
        >
          <Spoiler maxHeight={154} showLabel="Show more" hideLabel="Hide">
            {movie?.overview}
          </Spoiler>
        </Text>
        <Group className={styles.movieSliceButtons}>
          <SignedOut>
            <SignInButton>
              <Button
                size="lg"
                sx={{
                  zIndex: 10,
                }}
              >
                Reserve Now
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href={"/reserve"}>
              <Button
                size="lg"
                sx={{
                  zIndex: 10,
                }}
              >
                Reserve Now
              </Button>
            </Link>
          </SignedIn>
          <Link href={`movies/${movie?.id ?? ""}`}>
            <Button
              size="lg"
              variant="default"
              sx={{
                zIndex: 10,
              }}
            >
              More Info
            </Button>
          </Link>
        </Group>
      </Box>
    </Box>
  );
};

export default MovieCarousel;
