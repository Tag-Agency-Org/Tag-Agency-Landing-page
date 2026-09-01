import assert from "node:assert/strict";
import test from "node:test";
import { findIndianCity, searchIndianCities } from "../lib/indian-cities.ts";

test("returns canonical city suggestions without case-sensitive matching", () => {
  const suggestions = searchIndianCities("beng", 8);
  assert.equal(suggestions[0]?.name, "Bengaluru");
  assert.deepEqual(findIndianCity("bengaluru"), suggestions[0]);
});

test("does not resolve unlisted city text", () => {
  assert.equal(findIndianCity("Not A City"), undefined);
  assert.deepEqual(searchIndianCities("xqzz", 8), []);
});
