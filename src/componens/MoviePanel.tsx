import { Box, Button, Flex, Image, Text, Transition } from "@mantine/core";
import { Result } from "~/types";
import { useHover } from "@mantine/hooks";
import { IconStarFilled } from "@tabler/icons-react";

interface MoviePanelProps {
  movie: Result;
}

const formatDate = (date: Date | undefined) =>
  date ? date.toString().substring(0, 4) : "Unknown";

const MoviePanel: React.FC<MoviePanelProps> = ({ movie }) => {
  const tmdbImagePath = "https://image.tmdb.org/t/p/original";
  const { hovered: boxHover, ref: boxRef } = useHover();
  const { hovered: flexHover, ref: flexRef } = useHover();

  return (
    <Box pos={"relative"}>
      <Box
        ref={boxRef}
        mb={".25rem"}
        sx={(theme) => ({
          border: "solid 4px #AAA",
          borderColor: boxHover || flexHover ? theme.colors.blue : "#AAA",
          borderRadius: "5px",
          transition: "all 300ms ease-in-out",
          cursor: "pointer",
        })}
      >
        <Image
          src={tmdbImagePath + movie.poster_path}
          sx={{
            transition: "all 300ms ease-in-out",
            opacity: boxHover || flexHover ? 0.5 : 1,
          }}
        />
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
      >
        {movie?.title || movie?.name}
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
          {(styles) => <Button style={styles}>View Details</Button>}
        </Transition>
      </Flex>
    </Box>
  );
};

export default MoviePanel;
