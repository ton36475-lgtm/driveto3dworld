import test from "node:test";
import assert from "node:assert/strict";
import {
  bangkokTimestamp,
  directionsUrl,
  emptyFoodtruck,
  exportFoodtruck,
  FOODTRUCK_MAX_BYTES,
  parseFoodtruck,
  parsePrice,
  safeContactUrl,
  stopPhase,
  validTimestamp,
  type FoodtruckProfile,
} from "./model.ts";
const labels = { en: "Rice", th: "ข้าว", zh: "米饭" };
const menuId = "d4287399-ec68-47b1-97a4-33aafcc693a8";
const stopId = "c619279a-81a8-4941-9c02-2c1559207162";
function fixture(): FoodtruckProfile {
  return {
    ...emptyFoodtruck(),
    name: "Test kitchen",
    contactUrl: "https://example.com/contact",
    updatedAt: "2026-09-16T00:00:00.000Z",
    menu: [{ id: menuId, label: { ...labels }, priceMinor: 14550, soldOut: false }],
    stops: [
      {
        id: stopId,
        label: { ...labels },
        latitude: 16.82,
        longitude: 100.26,
        startAt: "2099-01-01T12:00:00+07:00",
        endAt: "2099-01-01T14:00:00+07:00",
      },
    ],
  };
}
test("empty profile invents no menu, location or business link", () => {
  assert.deepEqual(parseFoodtruck(exportFoodtruck(emptyFoodtruck())), emptyFoodtruck());
});
test("all three languages and exact minor prices survive a backup round trip", () => {
  assert.deepEqual(parseFoodtruck(exportFoodtruck(fixture())), fixture());
});
test("unsafe links reject credentials, script schemes, loopback and encoded numeric hosts", () => {
  for (const url of [
    "javascript:alert(1)",
    "http://example.com",
    "https://u:p@example.com",
    "https://localhost",
    "https://127.0.0.1",
    "https://2130706433",
    "https://[::1]",
    "https://x.local",
    "https://example.com:8443",
    "https://examp\nle.com",
  ])
    assert.equal(safeContactUrl(url), false, url);
  assert.equal(safeContactUrl("https://example.com/order?q=米饭"), true);
  assert.equal(safeContactUrl(""), true);
});
test("admission rejects missing Chinese, duplicate ids, unknown keys and invalid ranges", () => {
  const missing = fixture();
  delete (missing.menu[0].label as Partial<typeof labels>).zh;
  const duplicate = fixture();
  duplicate.stops[0].id = menuId;
  const coords = fixture();
  coords.stops[0].latitude = 91;
  const reversed = fixture();
  reversed.stops[0].endAt = reversed.stops[0].startAt;
  const tooMany = fixture();
  tooMany.menu = Array.from({ length: 41 }, () => tooMany.menu[0]);
  for (const invalid of [
    missing,
    duplicate,
    coords,
    reversed,
    tooMany,
    { ...fixture(), secret: "hidden" },
  ])
    assert.throws(() => parseFoodtruck(JSON.stringify(invalid)));
});
test("backup byte limit counts UTF-8 and export uses the same admission boundary", () => {
  const tooLarge = "饭".repeat(Math.floor(FOODTRUCK_MAX_BYTES / 3) + 1);
  assert.ok(tooLarge.length < FOODTRUCK_MAX_BYTES);
  assert.throws(() => parseFoodtruck(tooLarge), /large/);
  assert.throws(() => exportFoodtruck({ ...fixture(), name: "x".repeat(101) }));
});
test("prices never round away invalid third decimals or accept exponent notation", () => {
  assert.equal(parsePrice("145.50"), 14550);
  assert.equal(parsePrice("0.01"), 1);
  assert.equal(parsePrice("0"), 0);
  for (const value of ["1.005", "-1", "1e2", "1,000", "Infinity", "", "1000001"])
    assert.throws(() => parsePrice(value), value);
});
test("calendar and timezone validation rejects rollover dates and ambiguous local times", () => {
  assert.equal(validTimestamp("2024-02-29T12:00:00+07:00"), true);
  for (const value of [
    "2025-02-29T12:00:00+07:00",
    "2026-04-31T12:00:00Z",
    "2026-01-01T24:00:00Z",
    "2026-01-01T12:00:00",
    "2026-01-01T12:00:00+14:30",
  ])
    assert.equal(validTimestamp(value), false, value);
  assert.equal(bangkokTimestamp("2026-09-16T13:05"), "2026-09-16T13:05:00+07:00");
});
test("scheduled hours never claim live availability, and past ends are inclusive", () => {
  const stop = fixture().stops[0];
  assert.equal(stopPhase(stop, Date.parse(stop.startAt) - 1), "scheduled");
  assert.equal(stopPhase(stop, Date.parse(stop.startAt)), "plannedNow");
  assert.equal(stopPhase(stop, Date.parse(stop.endAt)), "past");
});
test("maps handoff preserves supplied coordinates and never adds live GPS or navigation actions", () => {
  const url = new URL(directionsUrl(fixture().stops[0]));
  assert.equal(url.origin, "https://www.google.com");
  assert.equal(url.pathname, "/maps/dir/");
  assert.equal(url.searchParams.get("api"), "1");
  assert.equal(url.searchParams.get("destination"), "16.82,100.26");
  assert.equal(url.searchParams.get("travelmode"), "driving");
  assert.equal(url.searchParams.has("origin"), false);
  assert.equal(url.searchParams.has("dir_action"), false);
  assert.throws(() => directionsUrl({ latitude: NaN, longitude: 100 }));
});
