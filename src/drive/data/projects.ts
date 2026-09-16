import type { Lang } from "./i18n";

export type ZoneId = "architecture" | "characters" | "vehicles" | "products";

export type Text = { en: string; th: string };

export type Project = {
  id: string;
  zone: ZoneId;
  title: Text;
  description: Text;
  detail: Text;
  year: string;
  medium: Text;
  tags: Text[];
  x: number;
  z: number;
  color: string;
};

export type Zone = {
  id: ZoneId;
  name: Text;
  x: number;
  z: number;
  color: string;
  pad: string;
  size: number;
};

export const ZONES: Zone[] = [
  { id: "architecture", name: { en: "Architecture", th: "สถาปัตย์" }, x: -42, z: -42, color: "#6ea0c8", pad: "#1d3348", size: 38 },
  { id: "characters", name: { en: "Characters", th: "ตัวละคร" }, x: 42, z: -42, color: "#c47a9a", pad: "#3a2230", size: 38 },
  { id: "vehicles", name: { en: "Vehicles", th: "ยานยนต์" }, x: 42, z: 42, color: "#7eae6e", pad: "#24341f", size: 38 },
  { id: "products", name: { en: "Products", th: "ผลิตภัณฑ์" }, x: -42, z: 42, color: "#c4a06a", pad: "#3a2e1c", size: 38 },
];

export const PROJECTS: Project[] = [
  {
    id: "arch-01",
    zone: "architecture",
    title: { en: "Glass Pavilion", th: "ศาลาแก้ว" },
    description: {
      en: "A minimal pavilion of structural glass and slim steel, with a parametric facade that reads as one folded plane.",
      th: "ศาลาแก้วโครงสร้างเหล็กเส้นบาง ผิวพาราเมตริกที่อ่านเป็นระนาบพับผืนเดียว",
    },
    detail: {
      en: "Commissioned as a monsoon-season folly. The roof is a single cold-bent laminate; columns sit outside the thermal envelope so the glass can run to the floor. Night lighting is a 2700K wash from the soffit, never from the facade.",
      th: "ออกแบบเป็นศาลาฤดูมรสุม หลังคาเป็นกระจกลามิเนตโค้งเย็นต้นเดียว เสานอกซองความร้อนเพื่อให้กระจกจรดพื้น แสงกลางคืนเป็นวอช 2700K จากท้องหลังคา",
    },
    year: "2025",
    medium: { en: "Archviz / form study", th: "อาร์ควิซ / รูปทรง" },
    tags: [
      { en: "glass", th: "กระจก" },
      { en: "steel", th: "เหล็ก" },
      { en: "pavilion", th: "ศาลา" },
    ],
    x: -28,
    z: -42,
    color: "#7ec8ff",
  },
  {
    id: "arch-02",
    zone: "architecture",
    title: { en: "Mekong House", th: "เรือนโขง" },
    description: {
      en: "Stilt dwelling reimagined as a cool-climate studio: teak lattice, lifted floor, monsoon-aware roof.",
      th: "เรือนยกใต้ถุนคิดใหม่เป็นสตูดิโออากาศเย็น ลายฉลุสัก พื้นยก หลังคารู้จักมรสุม",
    },
    detail: {
      en: "A live-work house on the Nan river terrace. Cross ventilation is the HVAC. The lattice is CNC-cut teak, repeating a lozenge taken from local weaving. The studio bay faces north-east, away from the afternoon glare.",
      th: "บ้านอยู่-ทำงานบนระเบียงแม่น้ำน่าน ลมขวางคือระบบปรับอากาศ ลายฉลุสักซีเอ็นซีจากลวดลายทอท้องถิ่น ช่องสตูดิโอหันตะวันออกเฉียงเหนือ",
    },
    year: "2024",
    medium: { en: "Residence concept", th: "บ้านพัก" },
    tags: [
      { en: "teak", th: "สัก" },
      { en: "stilt", th: "ใต้ถุน" },
      { en: "climate", th: "ภูมิอากาศ" },
    ],
    x: -52,
    z: -34,
    color: "#9ad4ff",
  },
  {
    id: "arch-03",
    zone: "architecture",
    title: { en: "Night Atelier", th: "โรงงานราตรี" },
    description: {
      en: "The studio itself — a long shed of blackened timber and a single clerestory, designed to disappear at dusk.",
      th: "ตัวสตูดิโอเอง — โรงยาวไม้เผาดำ ช่องแสงเดียว ออกแบบให้หายไปตอนโพล้เพล้",
    },
    detail: {
      en: "Plan is a 6 × 28 m bar. Work on the north, archive on the south, a kiln and dust room in a concrete pocket. The clerestory is the only aperture after 18:00; interior light is tuned so the building reads as a single ember from the road.",
      th: "ผังแท่ง 6 × 28 ม. งานด้านเหนือ คลังด้านใต้ เตาและห้องฝุ่นในกระเป๋าคอนกรีต ช่องแสงคือช่องเดียวหลังหกโมง แสงในอาคารตั้งให้มองจากถนนเป็นไตลุกก้อนเดียว",
    },
    year: "2026",
    medium: { en: "Workplace", th: "ที่ทำงาน" },
    tags: [
      { en: "timber", th: "ไม้" },
      { en: "night", th: "กลางคืน" },
      { en: "shed", th: "โรง" },
    ],
    x: -32,
    z: -52,
    color: "#5aa7e0",
  },
  {
    id: "char-01",
    zone: "characters",
    title: { en: "Robot Scout", th: "หุ่นสอดแนม" },
    description: {
      en: "Low-poly reconnaissance unit with a readable silhouette, game-ready UVs, and a single emissive eye.",
      th: "หุ่นลาดตระเวนโลว์โพลี เงาอ่านง่าย ยูวีพร้อมเกม และตาเรืองแสงดวงเดียว",
    },
    detail: {
      en: "8.4k tris, one 2k atlas, three LODs. The eye is a separate emissive so night shots hold. Idle cycle is a 4-second gyro sway; run cycle shares the same root motion as the hover-bike rider.",
      th: "8.4 พันไตร แอตลาส 2k หนึ่งแผ่น สาม LOD ตาเป็นอิมิสซีฟแยกเพื่อให้ช็อตกลางคืนอยู่ ไอดิลเป็นไกโรสี่วินาที รันใช้รูทโมชันเดียวกับคนขับโฮเวอร์ไบค์",
    },
    year: "2025",
    medium: { en: "Character / game", th: "ตัวละคร / เกม" },
    tags: [
      { en: "low-poly", th: "โลว์โพลี" },
      { en: "rig", th: "ริก" },
      { en: "emissive", th: "เรืองแสง" },
    ],
    x: 28,
    z: -42,
    color: "#f0a0c8",
  },
  {
    id: "char-02",
    zone: "characters",
    title: { en: "Clay Guardian", th: "ยักษ์ดินเผา" },
    description: {
      en: "Stylized yaksha in fired clay — temple massing, cracked glaze, and a quiet stance.",
      th: "ยักษ์สไตล์ดินเผา มวลแบบวัด เคลือบแตก และท่ายืนเงียบ",
    },
    detail: {
      en: "Sculpted in clay, 3D-scanned, then retopologized for real-time. The glaze crack is a baked cavity map, not a texture overlay. Pose is taken from a Sukhothai dvarapala, reduced to five masses.",
      th: "ปั้นดิน สแกน แล้วรีโทโปสำหรับเรียลไทม์ รอยเคลือบเป็นคาวิตี้แมป ไม่ใช่ทับเท็กซ์เจอร์ ท่ายืนจากทวารบาลสุโขทัย ย่อเหลือห้ามวล",
    },
    year: "2024",
    medium: { en: "Sculpture", th: "ประติมากรรม" },
    tags: [
      { en: "scan", th: "สแกน" },
      { en: "temple", th: "วัด" },
      { en: "clay", th: "ดิน" },
    ],
    x: 52,
    z: -34,
    color: "#e889b4",
  },
  {
    id: "char-03",
    zone: "characters",
    title: { en: "Drift Rider", th: "ไรเดอร์ดริฟต์" },
    description: {
      en: "Hero mesh for an arcade racer. Compact proportions, cloth sim on the scarf, PBR skin.",
      th: "ฮีโร่เมชสำหรับเกมแข่งอาร์เคด สัดส่วนกระชับ ผ้าคลุมซิมอผ้า ผิวพีบีอาร์",
    },
    detail: {
      en: "Built to sit on the hover-bike without clipping. Scarf is a 64-vert strip with two bones. Skin uses a calibrated albedo — no cavity in the color map. Face blendshapes cover blink, grin, and a wind squint.",
      th: "สร้างให้นั่งโฮเวอร์ไบค์โดยไม่คลิป ผ้าพันคอ 64 จุด สองโบน ผิวอัลเบโดสอบเทียบ ไม่มีคาวิตี้ในสี หน้ามีเบลนด์เชปกระพริบ ยิ้ม และหยีลม",
    },
    year: "2026",
    medium: { en: "Hero mesh", th: "ฮีโร่เมช" },
    tags: [
      { en: "hero", th: "ฮีโร่" },
      { en: "cloth", th: "ผ้า" },
      { en: "racer", th: "นักแข่ง" },
    ],
    x: 32,
    z: -52,
    color: "#d46a9c",
  },
  {
    id: "veh-01",
    zone: "vehicles",
    title: { en: "Hover Bike", th: "โฮเวอร์ไบค์" },
    description: {
      en: "A one-person hover craft with ducted fans and a visible chassis. Built to be driven, not just rendered.",
      th: "ยานลอยคนเดียว พัดลมท่อ และแชสซีที่เห็นได้ สร้างมาให้ขับ ไม่ใช่แค่เรนเดอร์",
    },
    detail: {
      en: "Wheelbase analogue is 1.8 m. Two counter-rotating ducts, battery spine, and a steering bar that maps 1:1 to the atelier car’s yaw. The underside glow is the same coral as the driveable car — a family mark.",
      th: "ฐานล้อเทียบ 1.8 ม. ท่อหมุนสวนทางสองชุด กระดูกสันหลังแบต และคันบังคับที่แมป 1:1 กับมุมหันของรถในลาน แสงใต้ท้องเป็นปะการังเดียวกับรถที่ขับได้",
    },
    year: "2025",
    medium: { en: "Vehicle concept", th: "ยานแนวคิด" },
    tags: [
      { en: "hover", th: "ลอย" },
      { en: "chassis", th: "แชสซี" },
      { en: "fan", th: "พัดลม" },
    ],
    x: 28,
    z: 42,
    color: "#b6e07a",
  },
  {
    id: "veh-02",
    zone: "vehicles",
    title: { en: "Concept Coupe", th: "คูเป้แนวคิด" },
    description: {
      en: "Long-nose coupe, three volumes, brushed aluminum and smoked glass. Studio lighting study included.",
      th: "คูเป้จมูกยาว สามก้อน อลูมิเนียมแปรงและกระจกควัน รวมการศึกษาแสงสตูดิโอ",
    },
    detail: {
      en: "A three-box proportion with a 0.62 cabin-to-body ratio. Materials are a measured brushed aluminium (roughness 0.22, anisotropy 0.7) and a 70% smoked glass. The lighting rig is a 3-point HDRI plus a 2×1 m area for the shoulder line.",
      th: "สัดส่วนสามกล่อง อัตรากะบะต่อตัวถัง 0.62 วัสดุอลูมิเนียมแปรงวัดค่า และกระจกควัน 70% ไฟเป็นเอชดีอาร์ไอสามจุดบวกไฟพื้นที่ 2×1 ม. ที่เส้นบ่า",
    },
    year: "2024",
    medium: { en: "Hard-surface", th: "ฮาร์ดเซอร์เฟส" },
    tags: [
      { en: "coupe", th: "คูเป้" },
      { en: "aluminum", th: "อลูมิเนียม" },
      { en: "studio", th: "สตูดิโอ" },
    ],
    x: 52,
    z: 34,
    color: "#96d45c",
  },
  {
    id: "veh-03",
    zone: "vehicles",
    title: { en: "Cargo Drone", th: "โดรนบรรทุก" },
    description: {
      en: "Utility hex-rotor with modular bays. Designed around service, not spectacle.",
      th: "เฮกซ์โรเตอร์ใช้งาน ช่องโมดูลาร์ ออกแบบรอบการซ่อม ไม่ใช่การโชว์",
    },
    detail: {
      en: "Six rotors, two hot-swap bays, landing skids that double as cable runs. The body is a single rotationally-moulded shell. Service hatch is four screws, same driver as the lamp product — a studio rule.",
      th: "หกโรเตอร์ สองช่องถอดร้อน ขาลงที่เดินสายได้ ตัวถังเปลือกหมุนขึ้นรูปฝาเดียว ฝาซ่อมสี่สกรู ไขควงเดียวกับโคม — กติกาสตูดิโอ",
    },
    year: "2026",
    medium: { en: "Industrial", th: "อุตสาหกรรม" },
    tags: [
      { en: "drone", th: "โดรน" },
      { en: "utility", th: "ยูทิลิตี้" },
      { en: "modular", th: "โมดูลาร์" },
    ],
    x: 32,
    z: 52,
    color: "#7cbe4a",
  },
  {
    id: "prod-01",
    zone: "products",
    title: { en: "Modular Lamp", th: "โคมโมดูลาร์" },
    description: {
      en: "3D-printable lamp of stacked rings. Warm 2700K source, interchangeable shades.",
      th: "โคมพิมพ์ 3 มิติจากวงซ้อน แหล่งอุ่น 2700K ฝาครอบสลับได้",
    },
    detail: {
      en: "Printed in PETG, 0.2 mm layers, no supports. Rings stack on a 12 mm steel rod. Shade is a cloth drum or a turned teak cup. The LED board is a standard 50 mm COB — replaceable without opening the stem.",
      th: "พิมพ์ PETG ชั้น 0.2 มม. ไม่ต้องซัพพอร์ต วงซ้อนบนแกนเหล็ก 12 มม. ฝาเป็นผ้าหรือถ้วยสักกลึง บอร์ดแอลอีดี COB 50 มม. มาตรฐาน เปลี่ยนได้โดยไม่ต้องเปิดลำ",
    },
    year: "2025",
    medium: { en: "Product viz", th: "งานผลิตภัณฑ์" },
    tags: [
      { en: "print", th: "พิมพ์" },
      { en: "lamp", th: "โคม" },
      { en: "modular", th: "โมดูลาร์" },
    ],
    x: -28,
    z: 42,
    color: "#e8c078",
  },
  {
    id: "prod-02",
    zone: "products",
    title: { en: "Halo Watch", th: "นาฬิกาเฮโล" },
    description: {
      en: "Cushion-case timepiece with a floating chapter ring. Materials: brushed steel, sapphire, calf.",
      th: "นาฬิกาเคสคุชชั่น วงชั่วโมงลอย วัสดุ: เหล็กแปรง แซปไฟร์ หนังลูกวัว",
    },
    detail: {
      en: "38.5 mm cushion, 10.2 mm thick, 20 mm lug. Chapter ring is a separate turned part, sat 0.4 mm above the dial. Hands are heat-blued steel. The strap is unlined calf, reverse-stitched, cut in Phitsanulok.",
      th: "คุชชั่น 38.5 มม. หนา 10.2 หู 20 วงชั่วโมงเป็นชิ้นกลึงแยก ลอยเหนือหน้าปัด 0.4 มม. เข็มเหล็กบลูด้วยความร้อน สายหนังลูกวัวไม่บุ เย็บกลับ ตัดที่พิษณุโลก",
    },
    year: "2024",
    medium: { en: "Wearable", th: "สวมใส่" },
    tags: [
      { en: "watch", th: "นาฬิกา" },
      { en: "steel", th: "เหล็ก" },
      { en: "dial", th: "หน้าปัด" },
    ],
    x: -52,
    z: 34,
    color: "#d4a85a",
  },
  {
    id: "prod-03",
    zone: "products",
    title: { en: "Audio Sphere", th: "ทรงเสียง" },
    description: {
      en: "Omnidirectional speaker as a single machined hemisphere. Cloth, aluminum, and a hidden port.",
      th: "ลำโพงรอบทิศเป็นครึ่งทรงกลึงชิ้นเดียว ผ้า อลูมิเนียม และพอร์ตซ่อน",
    },
    detail: {
      en: "A 180 mm hemisphere in 6061, cloth-wrapped upper, rear bass-reflex under the ring. Driver is a 3-inch full range. The object is meant to sit on a desk like a stone — no badge, no LED, a single tactile dimple for power.",
      th: "ครึ่งทรง 180 มม. อลูมิเนียม 6061 หุ้มผ้าด้านบน รีเฟล็กซ์หลังใต้ห่วง ไดรเวอร์ฟูลเรนจ์ 3 นิ้ว วางบนโต๊ะเหมือนก้อนหิน ไม่มีตราสินค้า ไม่มีไฟ หลุมสัมผัสหนึ่งจุดสำหรับเปิด",
    },
    year: "2026",
    medium: { en: "Object", th: "วัตถุ" },
    tags: [
      { en: "audio", th: "เสียง" },
      { en: "machine", th: "กลึง" },
      { en: "object", th: "วัตถุ" },
    ],
    x: -32,
    z: 52,
    color: "#c49248",
  },
];

export const ZONE_BY_ID = Object.fromEntries(ZONES.map((z) => [z.id, z])) as Record<ZoneId, Zone>;

export function t(text: Text, lang: Lang) {
  return text[lang];
}

export function nearestProject(x: number, z: number, exclude: string[] = []) {
  let best: Project | null = null;
  let bestD = Infinity;
  for (const p of PROJECTS) {
    if (exclude.includes(p.id)) continue;
    const d = Math.hypot(p.x - x, p.z - z);
    if (d < bestD) {
      bestD = d;
      best = p;
    }
  }
  return best ? { project: best, dist: bestD } : null;
}
