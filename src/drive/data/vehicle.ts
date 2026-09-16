/** Photo-reference reconstruction: inferred metres, Y-up, front -Z, wheel-centre origin. */
export const FOOD_TRUCK = {
  rootName: "FoodTruck_Body",
  bodyWidth: 2.05,
  bodyLength: 5.6,
  roofHeight: 2.78,
  wheelRadius: 0.37,
  frontHalfTrack: 0.91,
  rearHalfTrack: 0.96,
  frontAxleZ: -1.94,
  rearAxleZ: 1.52,
  rideHeight: 0.39,
  collisionRadius: 3.25,
  hatchAngle: 1.35,
} as const;

export type TruckAssetStatus = "loading" | "glb" | "fallback";
export const TRUCK_ASSET = "/models/foodtruck-body.glb";
export const vehicleAssetState: { status: TruckAssetStatus; asset: string } = {
  status: "loading",
  asset: TRUCK_ASSET,
};

export const TRUCK_WHEELS: [number, number, number][] = [
  [-FOOD_TRUCK.frontHalfTrack, 0, FOOD_TRUCK.frontAxleZ],
  [FOOD_TRUCK.frontHalfTrack, 0, FOOD_TRUCK.frontAxleZ],
  [-FOOD_TRUCK.rearHalfTrack, 0, FOOD_TRUCK.rearAxleZ],
  [FOOD_TRUCK.rearHalfTrack, 0, FOOD_TRUCK.rearAxleZ],
];

export const TRUCK_HATCHES = [
  { name: "ServingHatch_Pivot", position: [1.045, 2.39, 1.04], direction: 1 },
  { name: "OpposingHatch_Pivot", position: [-1.045, 2.39, 1.04], direction: -1 },
] as const;

/** Lamp centres in the released reference body; runtime materials replace only the drive faces. */
export const TRUCK_LAMPS = {
  front: { x: 0.68, y: 0.78, z: -2.735, width: 0.235, height: 0.22, depth: 0.032 },
  rear: { x: 0.78, y: 0.49, z: 2.543, width: 0.27, height: 0.125, depth: 0.026 },
} as const;
