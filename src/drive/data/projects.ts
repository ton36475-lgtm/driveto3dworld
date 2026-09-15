export type ZoneId = "architecture" | "characters" | "vehicles" | "products";

export type Project = {
  id: string;
  zone: ZoneId;
  title: string;
  description: string;
  year: string;
  medium: string;
  x: number;
  z: number;
  color: string;
  model: string;
};

export type Zone = {
  id: ZoneId;
  name: string;
  x: number;
  z: number;
  color: string;
  pad: string;
  size: number;
};

export const ZONES: Zone[] = [
  { id: "architecture", name: "Architecture", x: -42, z: -42, color: "#6ea0c8", pad: "#1d3348", size: 38 },
  { id: "characters", name: "Characters", x: 42, z: -42, color: "#c47a9a", pad: "#3a2230", size: 38 },
  { id: "vehicles", name: "Vehicles", x: 42, z: 42, color: "#7eae6e", pad: "#24341f", size: 38 },
  { id: "products", name: "Products", x: -42, z: 42, color: "#c4a06a", pad: "#3a2e1c", size: 38 },
];

export const PROJECTS: Project[] = [
  {
    id: "arch-01",
    zone: "architecture",
    title: "Glass Pavilion",
    description: "A minimal pavilion of structural glass and slim steel, with a parametric facade that reads as one folded plane.",
    year: "2025",
    medium: "Archviz / form study",
    x: -42,
    z: -42,
    color: "#7ec8ff",
    model: "/models/arch.glb",
  },
  {
    id: "arch-02",
    zone: "architecture",
    title: "Mekong House",
    description: "Stilt dwelling reimagined as a cool-climate studio: teak lattice, lifted floor, monsoon-aware roof.",
    year: "2024",
    medium: "Residence concept",
    x: -52,
    z: -34,
    color: "#9ad4ff",
    model: "/models/arch.glb",
  },
  {
    id: "arch-03",
    zone: "architecture",
    title: "Night Atelier",
    description: "The studio itself — a long shed of blackened timber and a single clerestory, designed to disappear at dusk.",
    year: "2026",
    medium: "Workplace",
    x: -32,
    z: -52,
    color: "#5aa7e0",
    model: "/models/arch.glb",
  },
  {
    id: "char-01",
    zone: "characters",
    title: "Robot Scout",
    description: "Low-poly reconnaissance unit with a readable silhouette, game-ready UVs, and a single emissive eye.",
    year: "2025",
    medium: "Character / game",
    x: 42,
    z: -42,
    color: "#f0a0c8",
    model: "/models/char.glb",
  },
  {
    id: "char-02",
    zone: "characters",
    title: "Clay Guardian",
    description: "Stylized yaksha in fired clay — temple massing, cracked glaze, and a quiet stance.",
    year: "2024",
    medium: "Sculpture",
    x: 52,
    z: -34,
    color: "#e889b4",
    model: "/models/char.glb",
  },
  {
    id: "char-03",
    zone: "characters",
    title: "Drift Rider",
    description: "Hero mesh for an arcade racer. Compact proportions, cloth sim on the scarf, PBR skin.",
    year: "2026",
    medium: "Hero mesh",
    x: 32,
    z: -52,
    color: "#d46a9c",
    model: "/models/char.glb",
  },
  {
    id: "veh-01",
    zone: "vehicles",
    title: "Hover Bike",
    description: "A one-person hover craft with ducted fans and a visible chassis. Built to be driven, not just rendered.",
    year: "2025",
    medium: "Vehicle concept",
    x: 42,
    z: 42,
    color: "#b6e07a",
    model: "/models/veh.glb",
  },
  {
    id: "veh-02",
    zone: "vehicles",
    title: "Concept Coupe",
    description: "Long-nose coupe, three volumes, brushed aluminum and smoked glass. Studio lighting study included.",
    year: "2024",
    medium: "Hard-surface",
    x: 52,
    z: 34,
    color: "#96d45c",
    model: "/models/veh.glb",
  },
  {
    id: "veh-03",
    zone: "vehicles",
    title: "Cargo Drone",
    description: "Utility hex-rotor with modular bays. Designed around service, not spectacle.",
    year: "2026",
    medium: "Industrial",
    x: 32,
    z: 52,
    color: "#7cbe4a",
    model: "/models/veh.glb",
  },
  {
    id: "prod-01",
    zone: "products",
    title: "Modular Lamp",
    description: "3D-printable lamp of stacked rings. Warm 2700K source, interchangeable shades.",
    year: "2025",
    medium: "Product viz",
    x: -42,
    z: 42,
    color: "#e8c078",
    model: "/models/prod.glb",
  },
  {
    id: "prod-02",
    zone: "products",
    title: "Halo Watch",
    description: "Cushion-case timepiece with a floating chapter ring. Materials: brushed steel, sapphire, calf.",
    year: "2024",
    medium: "Wearable",
    x: -52,
    z: 34,
    color: "#d4a85a",
    model: "/models/prod.glb",
  },
  {
    id: "prod-03",
    zone: "products",
    title: "Audio Sphere",
    description: "Omnidirectional speaker as a single machined hemisphere. Cloth, aluminum, and a hidden port.",
    year: "2026",
    medium: "Object",
    x: -32,
    z: 52,
    color: "#c49248",
    model: "/models/prod.glb",
  },
];

export const ZONE_BY_ID = Object.fromEntries(ZONES.map((z) => [z.id, z])) as Record<ZoneId, Zone>;
