import { Box, Button, Flex, Image, Text, Transition, rem } from "@mantine/core";
import { IDiscoverResult, ISearchResult, Result } from "~/types";
import { useHover } from "@mantine/hooks";
import { IconPhotoOff, IconStarFilled } from "@tabler/icons-react";
import { useRouter } from "next/router";

interface MoviePanelProps {
  movie: Result | IDiscoverResult | ISearchResult;
}

const formatDate = (date: string | Date | undefined) =>
  date ? date.toString().substring(0, 4) : "Unknown";

const MoviePanel: React.FC<MoviePanelProps> = ({ movie }) => {
  const tmdbImagePath = "https://image.tmdb.org/t/p/original";
  const { hovered: boxHover, ref: boxRef } = useHover();
  const { hovered: flexHover, ref: flexRef } = useHover();
  const router = useRouter();

  const handleMovie = () => {
    router.replace(`/movies/${movie.id}`);
  };

  return (
    <Box pos={"relative"} display={"flex"} sx={{ flexDirection: "column" }}>
      <Box
        display={"flex"}
        ref={boxRef}
        mb={".25rem"}
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark
              : theme.colors.blue[9],
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
          overflow: "hidden",
          border: "solid 4px #AAA",
          borderColor: boxHover || flexHover ? theme.colors.blue : "#AAA",
          borderRadius: "5px",
          transition: "all 300ms ease-in-out",
          cursor: "pointer",
        })}
        onClick={handleMovie}
      >
        {movie.poster_path ? (
          <Image
            src={tmdbImagePath + movie.poster_path}
            sx={{
              transition: "all 300ms ease-in-out",
              opacity: boxHover || flexHover ? 0.5 : 1,
              transform: boxHover || flexHover ? "scale(1.1)" : "scale(1)",
            }}
            withPlaceholder
          />
        ) : (
          <Box
            sx={{
              transition: "all 300ms ease-in-out",
              opacity: boxHover || flexHover ? 0.5 : 1,
            }}
          >
            <IconPhotoOff size={"3rem"} />
          </Box>
        )}
      </Box>
      <Text
        weight={"bold"}
        sx={{
          ":hover": {
            opacity: 0.7,
          },
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
          cursor: "pointer",
        }}
        onClick={handleMovie}
      >
        {movie?.title || "Unknown"}
      </Text>
      <Text opacity={0.7} size={"sm"}>
        {formatDate(movie.release_date)}
      </Text>
      <Flex
        ref={flexRef}
        direction={"column"}
        justify={"space-between"}
        align={"center"}
        pos={"absolute"}
        h={"70%"}
        top={"45%"}
        left={"50%"}
        sx={{
          cursor: "pointer",
          opacity: boxHover || flexHover ? 1 : 0,
          transition: "all 300ms ease-in-out",
          textAlign: "center",
          transform: "translate(-50%, -50%)",
        }}
        onClick={handleMovie}
      >
        <Box>
          <IconStarFilled style={{ color: "#1971C2" }} size={"3rem"} />
          <Text size={"1.75rem"} weight={"bold"} mb={"5rem"} color="white">
            {Math.round(movie.vote_average)}/10
          </Text>
        </Box>
        <Transition
          mounted={boxHover || flexHover}
          transition="slide-up"
          duration={300}
          timingFunction="ease"
        >
          {(styles) => (
            <Button style={styles} onClick={handleMovie}>
              View Details
            </Button>
          )}
        </Transition>
      </Flex>
    </Box>
  );
};

export default MoviePanel;
