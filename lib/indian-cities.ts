import cities from "../data/indian-cities.json" with { type: "json" };

export type IndianCity = {
  name: string;
  state: string;
  latitude: number;
  longitude: number;
};

const normalize = (value: string) =>
  value.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase("en-IN");

const byName = new Map(cities.map((city) => [normalize(city.name), city]));

export function findIndianCity(name: string) {
  return byName.get(normalize(name));
}

export function searchIndianCities(query: string, limit = 8) {
  const needle = normalize(query);
  return needle.length < 2
    ? []
    : cities.filter((city) => normalize(city.name).startsWith(needle)).slice(0, limit);
}

export function cityCoordinates(name: string) {
  const city = findIndianCity(name);
  return city
    ? { latitude: city.latitude, longitude: city.longitude }
    : undefined;
}
