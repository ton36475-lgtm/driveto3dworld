import { z } from "zod";

export const FOODTRUCK_KEY = "sxb-foodtruck-v1";
export const FOODTRUCK_MAX_BYTES = 128 * 1024;
export const truckLanguages = ["en", "th", "zh"] as const;
export type TruckLanguage = (typeof truckLanguages)[number];
const hasControl = (value: string, includeSpace = false) =>
  Array.from(value).some(
    (character) =>
      character.charCodeAt(0) <= (includeSpace ? 32 : 31) || character.charCodeAt(0) === 127,
  );
const cleanText = z
  .string()
  .trim()
  .min(1)
  .max(100)
  .refine((v) => !hasControl(v));
const localized = z.object({ en: cleanText, th: cleanText, zh: cleanText }).strict();
const id = z.string().uuid();

export function safeContactUrl(value: string): boolean {
  if (value === "") return true;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      !url.port &&
      !hasControl(value, true) &&
      !host.endsWith(".") &&
      /^[a-z0-9-]+(?:\.[a-z0-9-]+)+$/u.test(host) &&
      !/^\d+(?:\.\d+){3}$/u.test(host) &&
      !/(?:^|\.)(?:localhost|local|internal|test|invalid)$/u.test(host)
    );
  } catch {
    return false;
  }
}

export function validTimestamp(value: string): boolean {
  const match =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d{3})?)?(Z|[+-]\d{2}:\d{2})$/u.exec(
      value,
    );
  if (!match || !Number.isFinite(Date.parse(value))) return false;
  const [, year, month, day, hour, minute, second = "0", offset] = match;
  const y = Number(year),
    m = Number(month),
    d = Number(day);
  if (
    y < 2000 ||
    y > 2200 ||
    m < 1 ||
    m > 12 ||
    d < 1 ||
    Number(hour) > 23 ||
    Number(minute) > 59 ||
    Number(second) > 59
  )
    return false;
  if (d > new Date(Date.UTC(y, m, 0)).getUTCDate()) return false;
  if (
    offset !== "Z" &&
    (Number(offset.slice(1, 3)) > 14 ||
      Number(offset.slice(4)) > 59 ||
      (Number(offset.slice(1, 3)) === 14 && offset.slice(4) !== "00"))
  )
    return false;
  return true;
}
const timestamp = z.string().refine(validTimestamp);
const menuSchema = z
  .object({
    id,
    label: localized,
    priceMinor: z.number().int().min(0).max(100_000_000),
    soldOut: z.boolean(),
  })
  .strict();
const stopSchema = z
  .object({
    id,
    label: localized,
    latitude: z.number().finite().min(-90).max(90),
    longitude: z.number().finite().min(-180).max(180),
    startAt: timestamp,
    endAt: timestamp,
  })
  .strict()
  .refine((v) => Date.parse(v.endAt) > Date.parse(v.startAt));
export const foodtruckSchema = z
  .object({
    version: z.literal(1),
    updatedAt: timestamp.nullable(),
    name: z
      .string()
      .trim()
      .max(100)
      .refine((v) => !hasControl(v)),
    contactUrl: z.string().max(2000).refine(safeContactUrl),
    currency: z.enum(["THB", "USD", "CNY"]),
    menu: z.array(menuSchema).max(40),
    stops: z.array(stopSchema).max(40),
  })
  .strict()
  .refine((v) => {
    const ids = [...v.menu, ...v.stops].map((item) => item.id);
    return ids.length === new Set(ids).size;
  });
export type FoodtruckProfile = z.infer<typeof foodtruckSchema>;
export type MenuItem = FoodtruckProfile["menu"][number];
export type ServiceStop = FoodtruckProfile["stops"][number];
export const emptyFoodtruck = (): FoodtruckProfile => ({
  version: 1,
  updatedAt: null,
  name: "",
  contactUrl: "",
  currency: "THB",
  menu: [],
  stops: [],
});

export function parseFoodtruck(text: string): FoodtruckProfile {
  if (new TextEncoder().encode(text).byteLength > FOODTRUCK_MAX_BYTES) throw new Error("large");
  return foodtruckSchema.parse(JSON.parse(text));
}
export function exportFoodtruck(profile: FoodtruckProfile): string {
  const text = JSON.stringify(foodtruckSchema.parse(profile), null, 2);
  if (new TextEncoder().encode(text).byteLength > FOODTRUCK_MAX_BYTES) throw new Error("large");
  return text;
}
export function parsePrice(value: string): number {
  if (!/^\d{1,7}(?:\.\d{1,2})?$/u.test(value)) throw new Error("invalid");
  const [major, minor = ""] = value.split(".");
  const result = Number(major) * 100 + Number(minor.padEnd(2, "0"));
  if (result > 100_000_000) throw new Error("invalid");
  return result;
}
export function bangkokTimestamp(value: string): string {
  const result = `${value}:00+07:00`;
  if (!validTimestamp(result)) throw new Error("invalid");
  return result;
}
export function stopPhase(
  stop: ServiceStop,
  now = Date.now(),
): "past" | "scheduled" | "plannedNow" {
  if (now >= Date.parse(stop.endAt)) return "past";
  return now < Date.parse(stop.startAt) ? "scheduled" : "plannedNow";
}
export function directionsUrl(stop: Pick<ServiceStop, "latitude" | "longitude">): string {
  const point = z
    .object({
      latitude: z.number().finite().min(-90).max(90),
      longitude: z.number().finite().min(-180).max(180),
    })
    .parse(stop);
  const url = new URL("https://www.google.com/maps/dir/");
  url.searchParams.set("api", "1");
  url.searchParams.set("destination", `${point.latitude},${point.longitude}`);
  url.searchParams.set("travelmode", "driving");
  return url.href;
}
