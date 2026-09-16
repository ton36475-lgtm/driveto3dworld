export type FramePose = {
  x: number;
  y: number;
  z: number;
  rotY: number;
  angle: number;
};

/** Inner-face radius for the salon walls. Frames sit just inside this. */
export function wallRadius(count: number): number {
  if (count <= 1) return 4.4;
  return count > 6 ? 7.55 : 6.15;
}

export function framePoses(count: number, radius?: number): FramePose[] {
  if (count <= 1) {
    return [{ x: 0, y: 1.38, z: -0.2, rotY: 0, angle: Math.PI }];
  }
  const wall = wallRadius(count);
  const r = radius ?? wall - 0.52;
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    return {
      x: Math.sin(angle) * r,
      y: 1.46,
      z: Math.cos(angle) * r,
      rotY: angle + Math.PI,
      angle,
    };
  });
}

export function cameraForPose(pose: FramePose, distance = 3.2) {
  const a = pose.angle;
  return {
    x: pose.x - Math.sin(a) * distance,
    y: pose.y + 0.1,
    z: pose.z - Math.cos(a) * distance,
  };
}
