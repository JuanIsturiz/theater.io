import {
  Box,
  Button,
  Container,
  SegmentedControl,
  Select,
  SimpleGrid,
  Text,
  TextInput,
  Title,
  rem,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import type { NextPage } from "next";
import { env } from "~/env.mjs";
import type { IGenresJson } from "~/types";
import { useState } from "react";
import { IconSearch } from "@tabler/icons-react";

// search "https://api.themoviedb.org/3/search/movie?query=hola&include_adult=false&language=en-US&page=1";

// discover https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=someshit'

// everyfilter in discover (genre, release_date, etc) besides searchbar (query)

const LANG_OPTIONS = [
  "af-ZA",
  "ar-AE",
  "ar-SA",
  "be-BY",
  "bg-BG",
  "bn-BD",
  "ca-ES",
  "ch-GU",
  "cn-CN",
  "cs-CZ",
  "cy-GB",
  "da-DK",
  "de-AT",
  "de-CH",
  "de-DE",
  "el-GR",
  "en-AU",
  "en-CA",
  "en-GB",
  "en-IE",
  "en-NZ",
  "en-US",
  "eo-EO",
  "es-ES",
  "es-MX",
  "et-EE",
  "eu-ES",
  "fa-IR",
  "fi-FI",
  "fr-CA",
  "fr-FR",
  "ga-IE",
  "gd-GB",
  "gl-ES",
  "he-IL",
  "hi-IN",
  "hr-HR",
  "hu-HU",
  "id-ID",
  "it-IT",
  "ja-JP",
  "ka-GE",
  "kk-KZ",
  "kn-IN",
  "ko-KR",
  "ky-KG",
  "lt-LT",
  "lv-LV",
  "ml-IN",
  "mr-IN",
  "ms-MY",
  "ms-SG",
  "nb-NO",
  "nl-BE",
  "nl-NL",
  "no-NO",
  "pa-IN",
  "pl-PL",
  "pt-BR",
  "pt-PT",
  "ro-RO",
  "ru-RU",
  "si-LK",
  "sk-SK",
  "sl-SI",
  "sq-AL",
  "sr-RS",
  "sv-SE",
  "ta-IN",
  "te-IN",
  "th-TH",
  "tl-PH",
  "tr-TR",
  "uk-UA",
  "vi-VN",
  "zh-CN",
  "zh-HK",
  "zh-SG",
  "zh-TW",
  "zu-ZA",
];

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
  const res = await fetch(
    `${env.NEXT_PUBLIC_TMDB_BASE_URL}/genre/movie/list?language=en&api_key=${env.NEXT_PUBLIC_TMDB_API_KEY}`
  );
  const json: IGenresJson = await res.json();
  return json.genres;
};

// https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc'

const discoverMovies = async (query: string) => {
  const res = await fetch(
    `${env.NEXT_PUBLIC_TMDB_BASE_URL}/discover/movie?api_key=${env.NEXT_PUBLIC_TMDB_API_KEY}`
  );
  const json: IGenresJson = await res.json();
  return json.genres;
};

const Movies: NextPage = () => {
  const { data: genres } = useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
  });

  // search
  const [search, setSearch] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedOrderBy, setSelectedOrderBy] = useState<string | null>(null);
  const [selectedVoteAvg, setSelectedVoteAvg] = useState<string | null>(null);
  const [sort, setSort] = useState("asc");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  return (
    <main>
      <Title tt={"uppercase"} align="center" weight={"normal"}>
        movies
      </Title>
      <Text align="center" mb={"1rem"} opacity={0.6}>
        Browse and discover more movies!
      </Text>
      <Container size={"lg"}>
        <TextInput
          mb={rem(10)}
          label="Search Term"
          icon={<IconSearch size="0.8rem" />}
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
        />
        <SimpleGrid
          cols={5}
          breakpoints={[
            { maxWidth: "md", cols: 4, spacing: "md" },
            { maxWidth: "sm", cols: 3, spacing: "sm" },
            { maxWidth: "xs", cols: 2, spacing: "sm" },
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
          <Box>
            <Select
              searchable
              nothingFound="No options"
              clearable
              label="Language"
              placeholder="Pick one"
              value={selectedLanguage}
              onChange={setSelectedLanguage}
              data={LANG_OPTIONS.map((l) => ({
                value: l,
                label: l,
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
                { label: "Descending", value: "dsc" },
              ]}
            />
          </Box>
        </SimpleGrid>
      </Container>

      <Button
        onClick={() => {
          console.log({
            genre: genres?.find((g) => g.name === selectedGenre)?.id,
            search,
            selectedGenre,
            selectedOrderBy,
            selectedVoteAvg,
            sort,
          });
        }}
      >
        si
      </Button>
    </main>
  );
};

export default Movies;
