/** Original concept asset contract: metres, Y-up, front -Z, origin at wheel centres. */
export const FOOD_TRUCK = {
  rootName: "FoodTruck_Body",
  bodyWidth: 1.9,
  bodyLength: 3.4,
  roofHeight: 2.15,
  wheelRadius: 0.32,
  wheelHalfTrack: 0.95,
  frontAxleZ: -1.12,
  rearAxleZ: 1,
  rideHeight: 0.34,
  collisionRadius: 2.2,
} as const;

export const vehicleAssetState: { status: "loading" | "glb" | "fallback"; asset: string } = {
  status: "loading",
  asset: "/models/foodtruck-body.glb",
};

export const TRUCK_WHEELS: [number, number, number][] = [
  [-FOOD_TRUCK.wheelHalfTrack, 0, FOOD_TRUCK.frontAxleZ],
  [FOOD_TRUCK.wheelHalfTrack, 0, FOOD_TRUCK.frontAxleZ],
  [-FOOD_TRUCK.wheelHalfTrack, 0, FOOD_TRUCK.rearAxleZ],
  [FOOD_TRUCK.wheelHalfTrack, 0, FOOD_TRUCK.rearAxleZ],
];
